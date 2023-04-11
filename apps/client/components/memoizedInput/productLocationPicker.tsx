import { memo } from 'react';
import ProductLocationPicker from '../input/productLocationPicker';

export default memo(
  ProductLocationPicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
