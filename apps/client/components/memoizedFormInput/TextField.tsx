import { memo } from 'react';
import TextField from '../textField';

export default memo(
  TextField,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
