import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Readable } from 'stream';

export class PutObjectInput implements Partial<PutObjectCommandInput> {
  @ApiProperty()
    Body: string | Uint8Array | Buffer | Readable | ReadableStream<any> | Blob;

  @ApiPropertyOptional()
    Key: string;

  @ApiPropertyOptional()
    ACL?: string;

  @ApiPropertyOptional()
    CacheControl?: string;

  @ApiPropertyOptional()
    ContentDisposition?: string;

  @ApiPropertyOptional()
    ContentEncoding?: string;

  @ApiPropertyOptional()
    ContentLanguage?: string;

  @ApiPropertyOptional()
    ContentLength?: number;

  @ApiPropertyOptional()
    ContentMD5?: string;

  @ApiPropertyOptional()
    ContentType?: string;

  @ApiPropertyOptional()
    ChecksumAlgorithm?: string;

  @ApiPropertyOptional()
    ChecksumCRC32?: string;

  @ApiPropertyOptional()
    ChecksumCRC32C?: string;

  @ApiPropertyOptional()
    ChecksumSHA1?: string;

  @ApiPropertyOptional()
    ChecksumSHA256?: string;

  @ApiPropertyOptional()
    Expires?: Date;

  @ApiPropertyOptional()
    GrantFullControl?: string;

  @ApiPropertyOptional()
    GrantRead?: string;

  @ApiPropertyOptional()
    GrantReadACP?: string;

  @ApiPropertyOptional()
    GrantWriteACP?: string;

  @ApiPropertyOptional()
    Metadata?: Record<string, string>;

  @ApiPropertyOptional()
    ServerSideEncryption?: string;

  @ApiPropertyOptional()
    StorageClass?: string;

  @ApiPropertyOptional()
    WebsiteRedirectLocation?: string;

  @ApiPropertyOptional()
    SSECustomerAlgorithm?: string;

  @ApiPropertyOptional()
    SSECustomerKey?: string;

  @ApiPropertyOptional()
    SSECustomerKeyMD5?: string;

  @ApiPropertyOptional()
    SSEKMSKeyId?: string;

  @ApiPropertyOptional()
    SSEKMSEncryptionContext?: string;

  @ApiPropertyOptional()
    BucketKeyEnabled?: boolean;

  @ApiPropertyOptional()
    RequestPayer?: string;

  @ApiPropertyOptional()
    Tagging?: string;

  @ApiPropertyOptional()
    ObjectLockMode?: string;

  @ApiPropertyOptional()
    ObjectLockRetainUntilDate?: Date;

  @ApiPropertyOptional()
    ObjectLockLegalHoldStatus?: string;

  @ApiPropertyOptional()
    ExpectedBucketOwner?: string;
}
