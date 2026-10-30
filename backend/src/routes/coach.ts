import { Router } from 'express';
import { requireFields } from '../middleware/validate';
import { askCoach } from '../services/coachService';

const router = Router();

router.post('/', requireFields(['question']), (req, res) => {
  const result = askCoach(req.body.question as string);
  res.json(result);
});

export default router;
