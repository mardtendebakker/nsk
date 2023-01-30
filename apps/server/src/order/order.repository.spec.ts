import { OrderRepository } from './order.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('OrderRepository', () => {
  let prisma: PrismaService;
  beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PrismaService],
		}).compile();

		//Get a reference to the module's `PrismaService` and save it for usage in our tests.
		prisma = module.get<PrismaService>(PrismaService);
	});
  it('should be defined', () => {
    expect(new OrderRepository(prisma)).toBeDefined();
  });
});
