import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../file/file.service';
import { FileRepository } from './file.repository';
import { CreateFileDto } from './dto/upload-meta.dto';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { FileS3 } from './file.s3';

describe('FileService', () => {
  let service: FileService;

  const createFileDto: CreateFileDto = {
    discr: 'pr',
  };
  const file: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'logo.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 2390,
    buffer: Buffer.from('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', 'base64'),
    stream: new Readable,
    destination: '',
    filename: '',
    path: ''
  };

  const createResult = {
    id: 1,
    product_id: null,
    pickup_id: null,
    original_client_filename: "d4425835-34ca-4014-ba8c-21f63c7ccb5d.jpg",
    unique_server_filename: "revamp-test-bucket",
    discr: createFileDto.discr,
    external_id: null,
    order_id: null
  }

  const s3PutResult = {
    $metadata: {
      httpStatusCode: 200,
      requestId: 'CVKCSKAM9CBAB423',
      extendedRequestId: 'fMW5OwLQG0393Nt3NavgLiiazBKcwu4gsje9X+sYdD2UjmqHo0QqEDQEdbcRuObvk/Hj9L/snKs=',
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    },
    ETag: '"ab76607e4f959d192abbbe6640e08e9b"',
    ServerSideEncryption: 'AES256'
  }

  const fileRepository = {
    create: jest.fn(() => Promise.resolve(createResult)),
  };

  const fileS3 = {
    put: jest.fn(() => Promise.resolve(s3PutResult)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'S3_FILE_BUCKET') {
                return createResult.unique_server_filename;
              }
              return null;
            })
          }
        },
        {
          provide: FileRepository,
          useValue: fileRepository
        },
        {
          provide: FileS3,
          useValue: fileS3
        }
      ]
    })
    .compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a file', async () => {
    expect(await service.create(createFileDto, file.buffer)).toBe(createResult);
  });
});
