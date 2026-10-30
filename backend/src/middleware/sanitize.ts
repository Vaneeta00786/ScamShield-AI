import { Request, Response, NextFunction } from 'express';

/**
 * Strips HTML tags and trims strings in req.body to prevent XSS via stored data.
 * Runs recursively on nested objects.
 */
function sanitizeValue(val: unknown): unknown {
  if (typeof val === 'string') {
    return val
      .replace(/<[^>]*>/g, '')   // strip HTML tags
      .replace(/javascript:/gi, '') // strip js: URIs
      .trim();
  }
  if (Array.isArray(val)) return val.map(sanitizeValue);
  if (val !== null && typeof val === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      out[k] = sanitizeValue(v);
    }
    return out;
  }
  return val;
}

export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body) as Record<string, unknown>;
  }
  next();
}
