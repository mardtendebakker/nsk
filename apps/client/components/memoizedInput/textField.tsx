import { memo } from 'react';
import TextField from '../input/textField';

export default memo(
  TextField,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
