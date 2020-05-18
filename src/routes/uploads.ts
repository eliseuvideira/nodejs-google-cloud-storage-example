import { Router } from 'express';
import { multer } from '../middlewares/multer';
import { createImage, getImage, deleteImage } from '../controllers/uploads';

const router = Router();

router.post('/images', multer.single('image'), createImage);

router.get('/images/:imageId', getImage);

router.delete('/images/:imageId', deleteImage);

export default router;
