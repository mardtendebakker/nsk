import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

export class StockRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
    protected readonly isRepair?: boolean
  ) {}

  async findAll(params: Prisma.productFindManyArgs) {
    const { skip, cursor, select, orderBy } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;
    const { product_order, ...restWhere } = params.where;
    
    const where: Prisma.productWhereInput = {
      ...restWhere,
    };
  
    if (this.isRepair === true) {
      where.product_order = {
        some: { aorder: {}, ...product_order?.some },
        every: { aorder: { repair: { isNot: null } }, ...product_order?.every },
        ...(product_order?.none && { none: { ...product_order?.none } }),
      };
    } else if (this.isRepair === false) {
      where.product_order = {
        every: { aorder: { repair: { is: null } }, ...product_order?.every },
        ...(product_order?.some && { some: { ...product_order?.some } }),
        ...(product_order?.none && { none: { ...product_order?.none } }),
      };
    } else if (product_order) {
      where.product_order = { ...product_order };
    }
  
    const [count, data] = await this.prisma.$transaction([
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
      count: count ?? 0,
      data,
    };
  }

  findBy(params: Prisma.productFindManyArgs) {
    const { where, select, orderBy } = params;
    return this.prisma.product.findMany({ where, select, orderBy })
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

  findOneSelect(params: { id: number; select: Prisma.productSelect }) {
    const { id, select } = params;

    return this.prisma.product.findUnique({
      where: { id },
      select,
    });
  }

  findOneInclude(params: { id: number; include: Prisma.productInclude }) {
    const { id, include } = params;
    return this.prisma.product.findUnique({
      where: { id },
      include,
    });
  }

  updateOne(params: { id: number; data: Prisma.productUncheckedUpdateInput }) {
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

  getAllTypes(where?: Prisma.product_typeWhereInput) {
    return this.prisma.product_type.findMany({
      where,
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

  updateMany(params: Prisma.productUpdateManyArgs) {
    const { where, data } = params;

    return this.prisma.product.updateMany({
      where,
      data,
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

  getOptionByAttrIdAndName(attribute_id: number, name: string) {
    return this.prisma.attribute_option.upsert({
      where: {
        attribute_id_name: {
          attribute_id,
          name,
        },
      },
      create: {
        attribute_id,
        name,
      },
      update: {}
    });
  }

  getProductTypeByName(name: string) {
    return this.prisma.product_type.upsert({
      where: {
        name
      },
      create: {
        name,
        pindex: 50,
        is_public: false,
      },
      update: {}
    });
  }

  getAttributesByProductTypeId(productTypeId: number) {
    const include: Prisma.attributeInclude = {
      attribute_option: true,
    };
    const where: Prisma.attributeWhereInput = {
      product_type_attribute: {
        some: {
          product_type_id: productTypeId,
        },
      },
    };

    return this.prisma.attribute.findMany({
      include,
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

  addProductAttributes(data: Prisma.product_attributeCreateManyInput[]) {
    return this.prisma.product_attribute.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
