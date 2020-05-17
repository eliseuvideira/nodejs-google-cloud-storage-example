import { RequestHandler } from 'express';
import { Image } from '../models/Image';
import { v4 } from 'uuid';

export const createImage: RequestHandler = async (req, res, next) => {
  try {
    console.log('here');
    const imageId = v4();
    const imageName = req.file.originalname;
    const imageContentType = req.file.mimetype;
    const image = new Image({ imageId, imageName, imageContentType });
    console.log('here');
    await image.uploadImage(req.file);
    res.status(201).json({ image });
  } catch (err) {
    next(err);
  }
};

export const getImage: RequestHandler<{ imageId: string }> = (
  req,
  res,
  next,
) => {
  try {
    const { imageId } = req.params;
    console.log(imageId);
  } catch (err) {
    next(err);
  }
};

export const deleteImage: RequestHandler<{ imageId: string }> = (
  req,
  res,
  next,
) => {
  try {
    const { imageId } = req.params;
    console.log(imageId);
  } catch (err) {
    next(err);
  }
};
