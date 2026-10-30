import type { LinkInspectionResult } from '../types';

const SUSPICIOUS_TLDS = ['.tk', '.xyz', '.ru', '.ml', '.ga', '.cf', '.click', '.download', '.gq', '.top'];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'secure', 'bank', 'payment', 'account', 'confirm', 'update', 'signin', 'wallet'];
const BRAND_MISSPELLINGS = ['payppal', 'paypa1', 'amaz0n', 'amazom', 'g00gle', 'go0gle', 'faceb00k', 'facebok', 'netfl1x', 'bankofindla', 'sbibank', 'hdfcbankk'];

export function inspectLink(url: string): LinkInspectionResult {
  const findings: string[] = [];
  let lower: string;
  let hostname = '';

  try {
    const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
    lower = url.toLowerCase();
    hostname = parsed.hostname.toLowerCase();

    if (parsed.protocol === 'http:') findings.push('Uses insecure HTTP — no encryption. Credentials sent in plaintext.');
    const dots = hostname.split('.').length - 1;
    if (dots > 3) findings.push(`Excessive subdomains (${dots} dots) — often used to fake legitimacy (e.g. secure.bank.real.evil.com).`);
    if (/^\d{1,3}(\.\d{1,3}){3}/.test(hostname)) findings.push('URL uses a raw IP address instead of a domain name — major red flag.');
    if (SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld))) findings.push(`Suspicious top-level domain (${SUSPICIOUS_TLDS.find(t => hostname.endsWith(t)) ?? ''}) — commonly used for free phishing domains.`);
    if (url.length > 100) findings.push(`Unusually long URL (${url.length} chars) — often used to hide the real destination.`);
    const hitKeyword = SUSPICIOUS_KEYWORDS.find(kw => lower.includes(kw));
    if (hitKeyword) findings.push(`URL contains suspicious keyword '${hitKeyword}' — typical in phishing pages.`);
    const hitBrand = BRAND_MISSPELLINGS.find(b => hostname.includes(b));
    if (hitBrand) findings.push(`Possible brand impersonation detected: '${hitBrand}' — looks like a misspelling of a trusted brand.`);
  } catch {
    findings.push('URL could not be parsed — malformed or intentionally obfuscated.');
    lower = url.toLowerCase();
  }

  const count = findings.length;
  const riskLevel = count === 0 ? 'SAFE' : count <= 2 ? 'SUSPICIOUS' : ('HIGH_RISK' as const);

  const recommendations: Record<string, string> = {
    SAFE: 'Link appears clean. Still verify the site is what it claims by checking its domain registration.',
    SUSPICIOUS: 'Exercise caution. Do not enter personal or financial details until you verify this site independently.',
    HIGH_RISK: 'Do NOT click or visit this link. Multiple red flags detected. Report it to cybercrime.gov.in.',
  };

  return {
    url,
    isSuspicious: count > 0,
    riskLevel,
    findings,
    domainAge: 'Unknown (no live DNS lookup in demo mode)',
    redirectCount: 0,
    recommendation: recommendations[riskLevel],
  };
}
