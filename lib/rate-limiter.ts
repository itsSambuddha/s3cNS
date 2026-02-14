import { Redis } from 'ioredis';
import { NextRequest } from 'next/server';

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}

interface RateLimitTier {
    name: string;
    limits: {
        perMinute: number;
        perHour: number;
        perDay: number;
    };
}

// Rate limit tiers by endpoint type
export const RATE_LIMIT_TIERS: Record<string, RateLimitTier> = {
    PUBLIC: {
        name: 'Public Endpoints',
        limits: { perMinute: 20, perHour: 200, perDay: 2000 },
    },
    AUTH: {
        name: 'Authentication',
        limits: { perMinute: 10, perHour: 50, perDay: 200 },
    },
    PAYMENT: {
        name: 'Payment Operations',
        limits: { perMinute: 5, perHour: 20, perDay: 100 },
    },
    ADMIN: {
        name: 'Admin API',
        limits: { perMinute: 60, perHour: 1000, perDay: 10000 },
    }
};

class RateLimiter {
    private redis: Redis | null = null;
    private memoryStore: Map<string, { count: number; resetAt: number }> = new Map();

    constructor() {
        // Only initialize Redis if REDIS_URL is properly configured
        const redisUrl = process.env.REDIS_URL;
        if (redisUrl && redisUrl.trim().length > 0) {
            try {
                this.redis = new Redis(redisUrl);
            } catch (error) {
                console.warn('Failed to initialize Redis for rate limiting, falling back to in-memory store', error);
                this.redis = null;
            }
        }
    }

    private getKey(identifier: string, window: 'minute' | 'hour' | 'day'): string {
        const now = Date.now();
        const timestamp = Math.floor(now / this.getWindowMs(window));
        return `ratelimit:${identifier}:${window}:${timestamp}`;
    }

    private getWindowMs(window: 'minute' | 'hour' | 'day'): number {
        switch (window) {
            case 'minute': return 60 * 1000;
            case 'hour': return 60 * 60 * 1000;
            case 'day': return 24 * 60 * 60 * 1000;
        }
    }

    private async increment(key: string, windowMs: number): Promise<number> {
        if (this.redis) {
            const count = await this.redis.incr(key);
            if (count === 1) {
                await this.redis.pexpire(key, windowMs);
            }
            return count;
        }

        // Fallback to in-memory
        const now = Date.now();
        const entry = this.memoryStore.get(key);

        if (!entry || entry.resetAt < now) {
            this.memoryStore.set(key, { count: 1, resetAt: now + windowMs });
            return 1;
        }

        entry.count++;
        return entry.count;
    }

    private getClientIdentifier(req: NextRequest): string {
        // Try to get user ID from headers (populated by auth middleware)
        const userId = req.headers.get('x-user-id');
        if (userId) return `user:${userId}`;

        // Fallback to IP
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
            req.headers.get('x-real-ip') ||
            'unknown';

        return `ip:${ip}`;
    }

    async checkLimit(
        req: NextRequest,
        tier: keyof typeof RATE_LIMIT_TIERS
    ): Promise<{ allowed: boolean; retryAfter?: number; remaining?: number }> {
        const identifier = this.getClientIdentifier(req);
        const config = RATE_LIMIT_TIERS[tier];

        // Check all time windows
        const checks = [
            { window: 'minute' as const, limit: config.limits.perMinute },
            { window: 'hour' as const, limit: config.limits.perHour },
            { window: 'day' as const, limit: config.limits.perDay },
        ];

        for (const { window, limit } of checks) {
            const key = this.getKey(identifier, window);
            const count = await this.increment(key, this.getWindowMs(window));

            if (count > limit) {
                return {
                    allowed: false,
                    retryAfter: Math.ceil(this.getWindowMs(window) / 1000),
                };
            }
        }

        return { allowed: true };
    }
}

export const rateLimiter = new RateLimiter();
