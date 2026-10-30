import { Router } from 'express';
import { requireFields } from '../middleware/validate';
import { inspectLink } from '../services/linkService';

const router = Router();

router.post('/', requireFields(['url']), (req, res) => {
  const result = inspectLink(req.body.url as string);
  res.json(result);
});

export default router;
