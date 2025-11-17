import { memo } from 'react';
import OrderStatusDataSourcePicker from '../input/orderStatusDataSourcePicker';

export default memo(
  OrderStatusDataSourcePicker,
  (prevProps, nextProps) =>
    JSON.stringify(prevProps) === JSON.stringify(nextProps)
);
