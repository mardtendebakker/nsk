import { memo } from 'react';
import ProductStatusDataSourcePicker from '../input/productStatusDataSourcePicker';

export default memo(
  ProductStatusDataSourcePicker,
  (prevProps, nextProps) =>
    JSON.stringify(prevProps) === JSON.stringify(nextProps)
);
