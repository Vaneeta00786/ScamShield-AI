import { Router } from 'express';
import { requireFields } from '../middleware/validate';
import { getRadarReports, submitRadarReport, upvoteReport } from '../services/radarService';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await getRadarReports());
  } catch (err) { (next as (e: unknown) => void)(err); }
});

router.post('/submit', requireFields(['scamType', 'platform', 'location', 'description']), async (req, res, next) => {
  try {
    const report = await submitRadarReport({
      scamType: req.body.scamType as string,
      platform: req.body.platform as string,
      location: req.body.location as string,
      description: req.body.description as string,
    });
    res.json(report);
  } catch (err) { (next as (e: unknown) => void)(err); }
});

router.post('/upvote/:id', async (req, res, next) => {
  try {
    const voterIp = (req.headers['x-forwarded-for'] as string) ?? req.socket.remoteAddress ?? 'unknown';
    const { report, alreadyVoted } = await upvoteReport(req.params['id'], voterIp);
    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }
    res.json({ ...report, alreadyVoted });
  } catch (err) { (next as (e: unknown) => void)(err); }
});

export default router;
