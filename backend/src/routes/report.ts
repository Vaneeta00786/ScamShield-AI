import { Router, Request, Response, NextFunction } from 'express';
import { requireFields } from '../middleware/validate';
import { addReport, getAllReports } from '../services/reportService';

const router = Router();

router.post(
  '/',
  requireFields(['scamType', 'companyName', 'platform', 'description']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { scamType, companyName, platform, description } = req.body as {
        scamType: string;
        companyName: string;
        platform: string;
        description: string;
      };
      const report = await addReport({ scamType, companyName, platform, description });
      res.status(201).json({
        success: true,
        reportId: report.id,
        message: 'Report submitted successfully.',
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await getAllReports());
  } catch (err) {
    next(err);
  }
});

export default router;
