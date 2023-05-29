import { DeleteObjectCommand, DeleteObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileS3 {
  private readonly client: S3Client;
  constructor( private readonly configService: ConfigService ) {
    this.client = new S3Client({
      region: this.configService.get<string>('MAIN_REGION')
    });
  }

  async put(Key: string, Body: string | Uint8Array | Buffer) {
    const putCommand = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_FILE_BUCKET'),
      Key,
      Body,
      ACL:'public-read', //TODO: should changed to authenticated-read
    });

    return this.client.send(putCommand);
  }

  async delete(Key: string) {
    const delCommand = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('S3_FILE_BUCKET'),
      Key
    });

    return this.client.send(delCommand);
  }

  async deleteMany(Keys: string[]) {
    const delsCommand = new DeleteObjectsCommand({
      Bucket: this.configService.get<string>('S3_FILE_BUCKET'),
      Delete: {
        Objects: Keys.map(Key => ({ Key })),
      }
    });

    return this.client.send(delsCommand);
  }
}
