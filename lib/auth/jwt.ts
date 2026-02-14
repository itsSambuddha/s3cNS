import { jwtVerify } from 'jose'

export async function verifySessionToken(token: string | undefined) {
    // Defensive: handle missing token
    if (!token) return null;

    try {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            // JWT_SECRET not configured - log once but don't crash
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ JWT_SECRET not configured in .env.local - restart dev server after adding it');
            }
            return null;
        }

        const secret = new TextEncoder().encode(jwtSecret)
        const { payload } = await jwtVerify(token, secret)
        return payload // { uid, email, ... }
    } catch (error) {
        // Silent fail for invalid tokens (expected for logged-out users)
        return null
    }
}
