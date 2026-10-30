import { Router, Request, Response, NextFunction } from 'express';
import { getLiveDashboardStats, getLiveWeeklyData, getScanHistory } from '../services/scanTracker';
import { RECENT_ALERTS } from '../data/scamPatterns';

const router = Router();

router.get('/stats', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await getLiveDashboardStats();
    res.json(stats);
  } catch (err) { next(err); }
});

router.get('/weekly', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getLiveWeeklyData();
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/alerts', (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.json(RECENT_ALERTS);
  } catch (err) { next(err); }
});

// GET /api/dashboard/history — last 20 scans from MongoDB
router.get('/history', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const history = await getScanHistory(20);
    res.json(history);
  } catch (err) { next(err); }
});

export default router;
