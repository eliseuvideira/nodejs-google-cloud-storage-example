import { bucket } from '../utils/storage';
import { Readable } from 'stream';
import Knex from 'knex';

interface IImage {
  imageId: string;
  imageName: string;
  imageContentType: string;
}

export class Image implements IImage {
  public static async findOne(
    database: Knex,
    filter: Partial<IImage> | {} = {},
  ): Promise<Image | null> {
    const image = await database.from('images').where(filter).first();
    if (!image) {
      return null;
    }
    return new Image({ ...image });
  }

  public imageId: string;
  public imageName: string;
  public imageContentType: string;

  constructor({ imageId, imageName, imageContentType }: IImage) {
    this.imageId = imageId;
    this.imageName = imageName;
    this.imageContentType = imageContentType;
  }

  public async insertIntoStorage(file: Express.Multer.File): Promise<void> {
    const bucketFile = bucket.file(this.imageId);
    const stream = bucketFile.createWriteStream({
      metadata: { contentType: this.imageContentType },
      resumable: false,
    });
    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('finish', () => {
        bucketFile.makePublic().then(() => {
          resolve();
        });
      });
      stream.end(file.buffer);
    });
  }

  public async deleteFromStorage(): Promise<void> {
    const bucketFile = bucket.file(this.imageId);
    await bucketFile.delete();
  }

  public getReadStream(): Readable {
    const bucketFile = bucket.file(this.imageId);
    return bucketFile.createReadStream();
  }

  public async insert(database: Knex): Promise<void> {
    await database.from('images').insert({
      imageId: this.imageId,
      imageName: this.imageName,
      imageContentType: this.imageContentType,
    });
  }

  public async delete(database: Knex): Promise<void> {
    await database
      .from('images')
      .where({
        imageId: this.imageId,
      })
      .delete();
  }
}
