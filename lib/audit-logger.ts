import { headers } from 'next/headers';

type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
type EventType =
    | 'AUTH:SUCCESS' | 'AUTH:FAILURE'
    | 'ADMIN:ACCESS' | 'ADMIN:ACTION'
    | 'PAYMENT:SUCCESS' | 'PAYMENT:FAILURE'
    | 'UPLOAD:SUCCESS' | 'UPLOAD:FAILURE'
    | 'SECURITY:RATE_LIMIT';

interface AuditLogEntry {
    timestamp: string;
    eventType: EventType;
    severity: LogLevel;
    userId?: string;
    ip: string;
    userAgent: string;
    path: string;
    details: any;
}

class AuditLogger {
    async log(
        eventType: EventType,
        severity: LogLevel,
        details: any,
        userId?: string
    ) {
        let ip = 'unknown';
        let userAgent = 'unknown';
        let path = 'unknown';

        try {
            const h = await headers();
            ip = h.get('x-forwarded-for')?.split(',')[0] || 'unknown';
            userAgent = h.get('user-agent') || 'unknown';
            path = h.get('x-pathname') || 'unknown';
        } catch (e) {
            // In some contexts (e.g. background jobs), headers() might fail or be empty
        }

        const entry: AuditLogEntry = {
            timestamp: new Date().toISOString(),
            eventType,
            severity,
            userId,
            ip,
            userAgent,
            path,
            details: this.maskSensitiveData(details),
        };

        // In production, send to persistent storage (DB, Elasticsearch, CloudWatch)
        console.log(JSON.stringify(entry));
    }

    private maskSensitiveData(data: any): any {
        if (!data) return data;
        if (typeof data !== 'object') return data;

        // Simple deep copy to avoid mutating original
        const masked = JSON.parse(JSON.stringify(data));

        const sensitiveKeys = ['password', 'token', 'secret', 'creditCard', 'cvv'];

        const mask = (obj: any) => {
            for (const key in obj) {
                if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
                    obj[key] = '***REDACTED***';
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    mask(obj[key]);
                }
            }
        };

        mask(masked);
        return masked;
    }
}

export const auditLogger = new AuditLogger();
