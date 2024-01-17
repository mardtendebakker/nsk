export default function initFormState(
  {
    search, productType, location, productStatus, orderId,
  }:
  {
    search?: string,
    productType?: string,
    location?: string,
    productStatus?: string,
    orderId: string,
  },
) {
  return {
    search: {
      value: search,
    },
    productType: {
      value: productType || undefined,
    },
    location: {
      value: location || undefined,
    },
    productStatus: {
      value: productStatus || undefined,
    },
    orderId: {
      value: orderId,
    },
  };
}
