import { Request, Response, NextFunction } from 'express';

export function requireFields(fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const missing = fields.filter(
      (f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === ''
    );
    if (missing.length > 0) {
      const err = Object.assign(new Error(`Missing required fields: ${missing.join(', ')}`), {
        status: 400,
      });
      next(err);
      return;
    }
    next();
  };
}
