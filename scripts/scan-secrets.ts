import fs from 'fs';
import path from 'path';

const SECRET_PATTERNS = [
    { name: 'Generic API Key', pattern: /['"]([A-Za-z0-9_-]{32,})['"]/, severity: 'HIGH' },
    { name: 'AWS Key', pattern: /AKIA[0-9A-Z]{16}/, severity: 'CRITICAL' },
    { name: 'Private Key', pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/, severity: 'CRITICAL' },
    { name: 'OpenAI Key', pattern: /sk-[A-Za-z0-9]{48}/, severity: 'CRITICAL' },
    { name: 'Stripe Key', pattern: /sk_live_[A-Za-z0-9]{24,}/, severity: 'CRITICAL' },
    { name: 'JWT', pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/, severity: 'HIGH' },
    { name: 'Database URL', pattern: /(mongodb|postgresql|mysql):\/\/[^\s]+/, severity: 'CRITICAL' },
];

const IGNORE_PATTERNS = [
    /node_modules/,
    /\.git/,
    /\.next/,
    /dist/,
    /build/,
    /\.env/,
    /scan-secrets\.ts/,
    /package-lock\.json/,
    /yarn\.lock/,
    /\.png$/, /\.jpg$/, /\.jpeg$/, /\.ico$/, /\.svg$/,
];

function scanFile(filePath: string): void {
    if (IGNORE_PATTERNS.some(p => p.test(filePath))) return;

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        let found = false;

        SECRET_PATTERNS.forEach(({ name, pattern, severity }) => {
            lines.forEach((line, index) => {
                // Skip lines that look like they might be in a comment or example (heuristic)
                if (line.trim().startsWith('//') || line.includes('example')) return;

                if (pattern.test(line)) {
                    // Special case check: Don't flag imports or innocent strings
                    if (line.includes('import') || line.includes('require')) return;

                    console.error(`[${severity}] ${name} found in ${filePath}:${index + 1}`);
                    console.error(`  ${line.trim().substring(0, 100)}...`);
                    found = true;
                }
            });
        });

        if (found) {
            process.exitCode = 1;
        }

    } catch (e) {
        // Ignore read errors
    }
}

function scanDirectory(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        // basic ignore for hidden folders
        if (entry.name.startsWith('.') && entry.name !== '.env') return;

        if (entry.isDirectory()) {
            if (!IGNORE_PATTERNS.some(p => p.test(entry.name))) {
                scanDirectory(fullPath);
            }
        } else if (entry.isFile()) {
            scanFile(fullPath);
        }
    });
}

console.log('🔍 Scanning for secrets...');
scanDirectory(process.cwd());
if (!process.exitCode) {
    console.log('✅ No secrets detected');
} else {
    console.log('❌ Secrets detected! Please remove them before committing.');
}
