export default function initFormState(
  {
    search, productType, location, locationLabel, productStatus, orderId,
  }:
  {
    search?: string,
    productType?: string,
    location?: string,
    locationLabel?: string,
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
    locationLabel: {
      value: locationLabel || undefined,
    },
    productStatus: {
      value: productStatus || undefined,
    },
    orderId: {
      value: orderId,
    },
  };
}
