import { memo } from 'react';
import { Autocomplete } from '@mui/material';

export default memo(
  Autocomplete,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
