import { Router, Request, Response, NextFunction } from 'express';
import { requireFields } from '../middleware/validate';
import { analyzeText } from '../services/analyzeService';
import { recordScan } from '../services/scanTracker';

const router = Router();

router.post(
  '/',
  requireFields(['inputType', 'text']),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { inputType, text, companyName, jobUrl, platform } = req.body as {
        inputType: 'job_post' | 'chat' | 'offer_letter';
        text: string;
        companyName?: string;
        jobUrl?: string;
        platform?: string;
      };
      const result = analyzeText({ inputType, text, companyName, jobUrl, platform });
      // Fire-and-forget scan recording for live dashboard stats
      void recordScan({
        inputType: result.inputType,
        riskLevel: result.riskLevel,
        riskScore: result.riskScore,
        summary: result.summary,
        companyName,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
