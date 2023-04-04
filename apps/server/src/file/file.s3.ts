import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileS3 {
  private readonly client: S3Client;
  constructor( private readonly configService: ConfigService ) {
    this.client = new S3Client({
      region: this.configService.get<string>('COGNITO_REGION')
    });
  }

  async put(Key: string, Body: string | Uint8Array | Buffer) {
    const putCommand = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_FILE_BUCKET'),
      Key,
      Body,
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
}
