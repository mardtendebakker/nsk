import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserService } from './user.service';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let service: AdminUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUserService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'COGNITO_USER_POOL_ID') {
                return 'YOUR_COGNITO_USER_POOL_ID';
              }
              if (key === 'MAIN_REGION') {
                return 'YOUR_MAIN_REGION';
              }
              return null;
            })
          }
        },
      ],
    }).compile();

    service = module.get<AdminUserService>(AdminUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
