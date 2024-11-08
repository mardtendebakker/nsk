import { memo } from 'react';
import TextField from '../input/textField';

export default memo(
  TextField,
  (
    { inputRef, InputProps, ...prevProps },
    { inputRef: inputRef2, InputProps: InputProps2, ...nextProps },
  ) => JSON.stringify(prevProps) === JSON.stringify(nextProps) && InputProps === InputProps2,
);
