import { bucket } from '../utils/storage';
import { Readable } from 'stream';

interface IImage {
  imageId: string;
  imageName: string;
  imageContentType: string;
}

export class Image implements IImage {
  public imageId: string;
  public imageName: string;
  public imageContentType: string;

  constructor({ imageId, imageName, imageContentType }: IImage) {
    this.imageId = imageId;
    this.imageName = imageName;
    this.imageContentType = imageContentType;
  }

  public async uploadImage(file: Express.Multer.File): Promise<void> {
    const bucketFile = bucket.file(this.imageName);
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

  public getReadStream(): Readable {
    const bucketFile = bucket.file(this.imageName);
    return bucketFile.createReadStream();
  }
}
