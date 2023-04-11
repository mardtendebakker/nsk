import { memo } from 'react';
import ProductTypePicker from '../input/productTypePicker';

export default memo(
  ProductTypePicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
