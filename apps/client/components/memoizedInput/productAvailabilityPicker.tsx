import { memo } from 'react';
import ProductAvailabilityPicker from '../input/productAvailabilityPicker';

export default memo(
  ProductAvailabilityPicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
