import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Sanitization helpers
export const sanitize = {
    html: (input: string): string => {
        return DOMPurify.sanitize(input, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
            ALLOWED_ATTR: ['href', 'target', 'rel'],
        });
    },

    plainText: (input: string): string => {
        return input
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/[<>'"]/g, '') // Remove dangerous chars
            .trim();
    },

    filename: (input: string): string => {
        return input
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/\.+/g, '.')
            .replace(/^\.+/, '')
            .substring(0, 255);
    },
};

// Common validation schemas
export const schemas = {
    email: z.string()
        .email('Invalid email format')
        .max(254, 'Email too long')
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(8, 'Password must be at least 8 characters') // Relaxed slightly for UX, strict in backend if needed
        .max(128),

    uuid: z.string().uuid(),

    // MongoDB ObjectId approximation
    objectId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format'),

    url: z.string()
        .url('Invalid URL')
        .refine(url => url.startsWith('https://'), 'Only HTTPS URLs allowed'),

    safeText: (maxLength = 1000) => z.string()
        .max(maxLength)
        .transform(sanitize.plainText),

    richText: (maxLength = 5000) => z.string()
        .max(maxLength)
        .transform(sanitize.html),
};

export async function validateRequest<T extends z.ZodType>(schema: T, data: unknown): Promise<z.infer<T>> {
    try {
        return await schema.parseAsync(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            throw new Error(`Validation failed: ${message}`);
        }
        throw error;
    }
} 
