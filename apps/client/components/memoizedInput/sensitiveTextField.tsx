import { memo } from 'react';
import SensitiveTextField from '../input/sensitiveTextInput';

export default memo(
  SensitiveTextField,
  (
    { inputRef, InputProps, ...prevProps },
    { inputRef: inputRef2, InputProps: InputProps2, ...nextProps },
  ) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
