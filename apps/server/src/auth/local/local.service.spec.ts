import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalService } from './local.service';

describe('LocalService', () => {
  let service: LocalService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [LocalService],
    }).compile();

    service = app.get<LocalService>(LocalService);
  });

  describe('findOne', () => {
    it('should return user if user exists', async () => {
      const user = await service.findOne('test');
      expect(user).toBeDefined();
      expect(user?.username).toEqual('test');
    });

    it('should return undefined if user does not exist', async () => {
      const user = await service.findOne('nonexistent');
      expect(user).toBeUndefined();
    });
  });

  describe('signIn', () => {
    it('should sign in user with correct credentials', async () => {
      const user = await service.signIn('test', 'Password@123');
      expect(user).toBeDefined();
      expect(user.username).toEqual('test');
      expect(user.password).toBeUndefined();
    });

    it('should throw UnauthorizedException if credentials are incorrect', async () => {
      await expect(service.signIn('test', 'wrongPassword')).rejects.toThrow(UnauthorizedException);
    });
  });
});
