import { memo } from 'react';
import Select from '../input/select';

export default memo(
  Select,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
