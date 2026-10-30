import { Router, Request, Response, NextFunction } from 'express';
import { SCAM_PATTERNS } from '../data/scamPatterns';

const router = Router();

router.get('/patterns', (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.json(SCAM_PATTERNS);
  } catch (err) {
    next(err);
  }
});

export default router;
