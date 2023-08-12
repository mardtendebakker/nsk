import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IS_SERVICE } from '../service/types/is-service.enum';
import { REPAIR_PRODUCT_NAME } from './types/repair-product-name.enum';
import { Product } from './dto/update-many-product.dto';

export class StockRepository {
  private isServiceWhere: { name?: string } = {};

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly isService?: boolean
  ) {
    this.isServiceWhere = this.isService == IS_SERVICE && {
      name: REPAIR_PRODUCT_NAME,
    };
  }

  async findAll(params: Prisma.productFindManyArgs) {
    const { skip, cursor, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const where: Prisma.productWhereInput = {
      ...params.where,
      ...this.isServiceWhere,
    };
    const submission = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        skip,
        take,
        cursor,
        where,
        select,
        orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  create(createData: Prisma.productUncheckedCreateInput) {
    const data = {
      ...createData,
      ...this.isServiceWhere,
    };

    return this.prisma.product.create({
      data,
    });
  }

  findOne(params: { where: Prisma.productWhereUniqueInput }) {
    const where = { ...params.where, ...this.isServiceWhere };
    return this.prisma.product.findUnique({ where });
  }

  findOneSelect(params: {
    where: Prisma.productWhereUniqueInput;
    select: Prisma.productSelect;
  }) {
    const where = { ...params.where, ...this.isServiceWhere };
    const { select } = params;
    
    return this.prisma.product.findUnique({
      where,
      select,
    });
  }

  findOneInclude(params: {
    where: Prisma.productWhereUniqueInput;
    include: Prisma.productInclude;
  }) {
    const where = { ...params.where, ...this.isServiceWhere };
    const { include } = params;
    return this.prisma.product.findUnique({
      where,
      include,
    });
  }

  updateOne(params: {
    where: Prisma.productWhereUniqueInput;
    data: Prisma.productUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.product.update({
      where,
      data,
      include: {
        product_attribute_product_attribute_product_idToproduct: true,
      },
    });
  }

  getAllStatus() {
    return this.prisma.product_status.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  getAllTypes() {
    return this.prisma.product_type.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  deleteOne(id: number) {
    return this.prisma.product.deleteMany({ where: { id } });
  }

  updateMany(params: { where: Prisma.aorderWhereInput; data: Product }) {
    const { where, data } = params;

    return this.prisma.product.updateMany({
      data,
      where,
    });
  }

  findProductAttributesIncludeAttribute(id: number) {
    const include: Prisma.product_attributeInclude = {
      attribute: true,
    };

    return this.prisma.product_attribute.findMany({
      include,
      where: {
        product_id: id,
      },
    });
  }

  getAttributesByProductTypeId(productTypeId: number) {
    const where: Prisma.attributeWhereInput = {
      product_type_attribute: {
        some: {
          product_type_id: productTypeId,
        },
      },
    };

    return this.prisma.attribute.findMany({
      where,
    });
  }

  deleteProductAttributes(id: number) {
    return this.prisma.product_attribute.deleteMany({
      where: {
        product_id: id,
      },
    });
  }

  async getAttributesByTypeId(typeId) {
    const productTypeAttributes =
      await this.prisma.product_type_attribute.findMany({
        where: {
          product_type_id: typeId,
        },
        include: {
          attribute: true,
        },
      });

    return productTypeAttributes.map(
      (productTypeAttribute) => productTypeAttribute.attribute
    );
  }

  addProductAttributes(data: Prisma.product_attributeCreateManyInput[]) {
    return this.prisma.product_attribute.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
