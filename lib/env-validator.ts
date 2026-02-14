import { z } from 'zod';

const envSchema = z.object({
    // Database
    MONGODB_URI: z.string().url().startsWith('mongodb'),
    MONGODB_DB: z.string().optional().default('s3cns'),

    // API Keys - Server Side Only
    // OPENAI_API_KEY: z.string().regex(/^sk-[A-Za-z0-9]{48}$/).optional(), // Uncomment if used
    // GOOGLE_API_KEY: z.string().startsWith('AIza').optional(), // Uncomment if used

    // Security
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 chars"),

    // Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),

    // Rate Limiting
    REDIS_URL: z.string().url().optional(),

    // CORS
    ALLOWED_ORIGINS: z.string().optional().transform(s => s ? s.split(',') : []),
});

// Validate on server startup
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    // In production, we might want to throw. For now, we log error.
    if (process.env.NODE_ENV === 'production') {
        throw new Error("Invalid environment variables");
    }
}

export const env = _env.success ? _env.data : process.env as unknown as z.infer<typeof envSchema>;

// Check for dangerous patterns
const dangerousPatterns = [
    { pattern: /NEXT_PUBLIC_.*SECRET/i, message: 'Never use NEXT_PUBLIC_ for secrets!' },
    { pattern: /test.*key/i, env: 'production', message: 'Test keys in production!' },
    { pattern: /localhost/i, env: 'production', message: 'Localhost URLs in production!' },
];

dangerousPatterns.forEach(({ pattern, env: targetEnv, message }) => {
    if (targetEnv && process.env.NODE_ENV !== targetEnv) return;
    Object.entries(process.env).forEach(([key, value]) => {
        if (value && (pattern.test(key) || pattern.test(value))) {
            console.warn(`⚠️ SECURITY WARNING: ${message} (${key})`);
        }
    });
});
