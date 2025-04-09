import {
  ChecksumAlgorithm, ObjectCannedACL, ObjectLockLegalHoldStatus, ObjectLockMode, PutObjectCommandInput, RequestPayer, ServerSideEncryption, StorageClass,
} from '@aws-sdk/client-s3';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Readable } from 'stream';

export class PutObjectInput implements Partial<PutObjectCommandInput> {
  @ApiProperty()
    Body: string | Uint8Array | Buffer | Readable | ReadableStream<any> | Blob;

  @ApiPropertyOptional()
    Key: string;

  @ApiPropertyOptional()
  @IsEnum(ObjectCannedACL)
    ACL?: ObjectCannedACL;

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
  @IsEnum(ChecksumAlgorithm)
    ChecksumAlgorithm?: ChecksumAlgorithm;

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
  @IsEnum(ServerSideEncryption)
    ServerSideEncryption?: ServerSideEncryption;

  @ApiPropertyOptional()
  @IsEnum(StorageClass)
    StorageClass?: StorageClass;

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
  @IsEnum(RequestPayer)
    RequestPayer?: RequestPayer;

  @ApiPropertyOptional()
    Tagging?: string;

  @ApiPropertyOptional()
  @IsEnum(ObjectLockMode)
    ObjectLockMode?: ObjectLockMode;

  @ApiPropertyOptional()
    ObjectLockRetainUntilDate?: Date;

  @ApiPropertyOptional()
  @IsEnum(ObjectLockLegalHoldStatus)
    ObjectLockLegalHoldStatus?: ObjectLockLegalHoldStatus;

  @ApiPropertyOptional()
    ExpectedBucketOwner?: string;
}
