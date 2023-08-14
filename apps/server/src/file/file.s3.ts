import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectInput } from "./dto/put-object-input.dto";

@Injectable()
export class FileS3 {
  private readonly client: S3Client;
  constructor( private readonly configService: ConfigService ) {
    this.client = new S3Client({
      region: this.configService.get<string>('MAIN_REGION')
    });
  }

  async get(Key: string) {
    if (Key === undefined) {
      throw new Error("The Key must be provided");
    }

    const delCommand = new GetObjectCommand({
      Bucket: this.configService.get<string>('S3_FILE_BUCKET'),
      Key
    });

    return this.client.send(delCommand);
  }

  async put(putObjectInput: PutObjectInput) {
    const putCommand = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_FILE_BUCKET'),
      ...putObjectInput,
    });

    return this.client.send(putCommand);
  }

  async delete(Key: string) {
    if (Key === undefined) {
      throw new Error("The Key must be provided");
    }

    const delCommand = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('S3_FILE_BUCKET'),
      Key
    });

    return this.client.send(delCommand);
  }

  async deleteMany(Keys: string[]) {
    if (Keys.length === 0) {
      throw new Error("At least one key must have provided");
    }

    const delsCommand = new DeleteObjectsCommand({
      Bucket: this.configService.get<string>('S3_FILE_BUCKET'),
      Delete: {
        Objects: Keys.map(Key => ({ Key })),
      }
    });

    return this.client.send(delsCommand);
  }
}
