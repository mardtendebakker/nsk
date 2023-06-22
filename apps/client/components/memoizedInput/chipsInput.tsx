import { memo } from 'react';
import ChipsInput from '../input/chipsInput';

export default memo(
  ChipsInput,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
