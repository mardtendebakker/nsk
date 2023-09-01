import { ProductTypeRelation } from "./types/product-type-relation";

export class ProductTypeProcess {
  constructor(private readonly productType: ProductTypeRelation) {}

  run() {
    const {
      product_type_attribute,
      product_type_task,
      ...rest
    } = this.productType;

    return {
      ...rest,
      attributes: product_type_attribute.map(
        ({ attribute: { attribute_option, ...rest } }: any) => ({
          ...rest,
          options: attribute_option,
        })
      ),
      tasks: product_type_task.map(
        ({ task: { id, name } }: any) => ({
          id,
          name
        })
      ),
    }
  }
}
