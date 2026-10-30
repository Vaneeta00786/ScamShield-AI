import { Router } from 'express';
import multer from 'multer';
import { storeEvidence, getAllEvidence, deleteEvidence } from '../services/evidenceService';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const evidence = await storeEvidence(req.file, req.body.notes as string | undefined);
    res.json(evidence);
  } catch (err) { (next as (e: unknown) => void)(err); }
});

router.get('/', async (_req, res, next) => {
  try {
    res.json({
      files: await getAllEvidence(),
      notice: 'Evidence is stored securely. Files will persist if MongoDB is connected; otherwise server memory is used as fallback. For permanent official evidence, submit to cybercrime.gov.in.',
    });
  } catch (err) { (next as (e: unknown) => void)(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deleteEvidence(req.params['id']);
    if (!deleted) {
      res.status(404).json({ error: 'Evidence not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) { (next as (e: unknown) => void)(err); }
});

export default router;
