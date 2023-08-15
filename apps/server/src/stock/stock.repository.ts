import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from './dto/update-many-product.dto';

export class StockRepository {
  private serviceWhere: Prisma.productWhereInput = {};

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly isRepair?: boolean
  ) {
    this.serviceWhere = {
      product_order: {
        ...(isRepair
          ? {
              some: { aorder: { isNot: null } },
              every: {
                aorder: { repair: { isNot: null } },
              },
            }
          : {
              every: {
                aorder: { repair: { is: null } },
              },
            }),
      },
    };
  }

  async findAll(params: Prisma.productFindManyArgs) {
    const { skip, cursor, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const { 
      product_order,
    ...restWhere } = params.where;
    const where: Prisma.productWhereInput = {
      ...(product_order ? { product_order } : this.serviceWhere),
      ...restWhere,
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
    return this.prisma.product.create({
      data: createData,
    });
  }

  findOne(params: { where: Prisma.productWhereUniqueInput }) {
    const where = { ...params.where };
    return this.prisma.product.findUnique({ where });
  }

  findOneSelect(params: {
    id: number;
    select: Prisma.productSelect;
  }) {
    const { id, select } = params;
    
    return this.prisma.product.findUnique({
      where: { id },
      select,
    });
  }

  findOneInclude(params: {
    id: number;
    include: Prisma.productInclude;
  }) {
    const { id, include } = params;
    return this.prisma.product.findUnique({
      where: { id },
      include,
    });
  }

  updateOne(params: {
    id: number;
    data: Prisma.productUpdateInput;
  }) {
    const { id, data } = params;
    return this.prisma.product.update({
      where: { id },
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
    return this.prisma.product.delete({ where: { id } });
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
