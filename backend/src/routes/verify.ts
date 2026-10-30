import { Router, Request, Response, NextFunction } from 'express';
import { requireFields } from '../middleware/validate';
import { verifyCompany } from '../services/verifyService';

const router = Router();

router.post(
  '/',
  requireFields(['companyName']),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { companyName, cin, website } = req.body as {
        companyName: string;
        cin?: string;
        website?: string;
      };
      const result = verifyCompany({ companyName, cin, website });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
