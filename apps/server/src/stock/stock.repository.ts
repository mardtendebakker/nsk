import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { IsRepairService } from "./types/is-repair-service.enum";
import { RepairProductName } from "./types/repair-product-name.enum";
import { Product } from "./dto/update-many-product.dto";

export class StockRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly isRepairService: IsRepairService
  ) {
    // TODO: prisma middleware for updateAt
    prisma.$use(async (params, next) => {
      if (params.model == 'product' && params.action == 'create' && params.args.data?.price) {
        params.args.data.price *= 100;
        return await next(params);
      }
      return next(params);
    });

    prisma.$use(async (params, next) => {
      if (params.model == 'product' && ['findFirst', 'findUnique'].includes(params.action) && 
      (params.args.select?.price || params.args.include?.price)) {
        const product = await next(params);
        return {
          ...product,
          ...{price: (product.price || 0 / 100)},
        };
      }
      return next(params);
    });

    prisma.$use(async (params, next) => {
      if (params.model == 'product' && params.action == 'findMany' &&
      (params.args.select?.price || params.args.include?.price) ) {
        const products = await next(params);
        return products.map(product => ({
          ...product,
          ...({price: (product.price || 0 / 100)}),
        }));
      }
      return next(params);
    });
  }

  async findAll(params: Prisma.productFindManyArgs) {
    const { skip, cursor, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const where = {
      ...params.where,
      ...(this.isRepairService == IsRepairService.YES && {name: RepairProductName.REPAIR_PRODUCT_NAME})
    }
    const submission = await this.prisma.$transaction([
      this.prisma.product.count({where}),
      this.prisma.product.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  create(createData: Prisma.productCreateInput) {
    const data = {
      ...createData,
      ...(this.isRepairService == IsRepairService.YES && {name: RepairProductName.REPAIR_PRODUCT_NAME})
    }
    return this.prisma.product.create({
      data
    });
  }
  
  findOne(params: Prisma.productFindUniqueArgs) {
    const { select, include } = params;
    const where = {
      ...params.where,
      ...(this.isRepairService == IsRepairService.YES && {name: RepairProductName.REPAIR_PRODUCT_NAME})
    }
    if (include) {
      return this.prisma.product.findUnique({ where, include });
    }
    return this.prisma.product.findUnique({ where, select });
  }
  
  updateOne(params: {
    where: Prisma.productWhereUniqueInput;
    data: Prisma.productUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.product.update({
      where,
      data,
    });
  }
  
  getAllStatus() {
    return this.prisma.product_status.findMany({
      select: {
        id: true,
        name: true
      }
    });
  }
  
  getAllTypes() {
    return this.prisma.product_type.findMany({
      select: {
        id: true,
        name: true
      }
    });
  }

  deleteMany(ids: number[]) {
    return this.prisma.product.deleteMany({where: {id : {in: ids}}})
  }
  
  updateMany(params: {
    where: Prisma.aorderWhereInput;
    data: Product;
  }) {
    const { where, data } = params;
    return this.prisma.product.updateMany({
      data,
      where,
    });
  }
}
