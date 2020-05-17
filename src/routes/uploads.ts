import { Router } from 'express';
import { multer } from '../middlewares/multer';
import { createImage } from '../controllers/uploads';

const router = Router();

router.post('/images', multer.single('image'), createImage);

router.get('/images/:imageId');

router.delete('/images/:imageId');

export default router;
