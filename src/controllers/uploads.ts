import { RequestHandler } from 'express';
import { Image } from '../models/Image';
import { v4 } from 'uuid';
import { database } from '../utils/database';
import { HttpError } from '../utils/HttpError';

export const createImage: RequestHandler = async (req, res, next) => {
  try {
    const image = new Image({
      imageId: v4(),
      imageName: req.file.originalname,
      imageContentType: req.file.mimetype,
    });
    await image.insert(database);
    await image.insertIntoStorage(req.file);
    res.status(201).json({ image });
  } catch (err) {
    next(err);
  }
};

export const getImage: RequestHandler<{ imageId: string }> = async (
  req,
  res,
  next,
) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findOne(database, { imageId });
    if (!image) {
      throw new HttpError(404, 'Not found');
    }
    image.getReadStream().pipe(res.status(200));
  } catch (err) {
    next(err);
  }
};

export const deleteImage: RequestHandler<{ imageId: string }> = async (
  req,
  res,
  next,
) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findOne(database, { imageId });
    if (!image) {
      throw new HttpError(404, 'Not found');
    }
    await image.delete(database);
    await image.deleteFromStorage();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
