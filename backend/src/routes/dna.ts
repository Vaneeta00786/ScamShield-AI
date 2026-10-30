import { Router } from 'express';
import { requireFields } from '../middleware/validate';
import { analyzeBehavior } from '../services/dnaService';

const router = Router();

router.post('/', requireFields(['text']), (req, res) => {
  const result = analyzeBehavior(req.body.text as string);
  res.json(result);
});

export default router;
