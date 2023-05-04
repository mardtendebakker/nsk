import { memo } from 'react';
import TextField from '../input/textField';

export default memo(
  TextField,
  (
    { inputRef, ...prevProps },
    { inputRef: inputRef2, ...nextProps },
  ) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
