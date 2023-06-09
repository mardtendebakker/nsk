import { memo } from 'react';
import DataSourcePicker from '../input/dataSourcePicker';

export default memo(
  DataSourcePicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
