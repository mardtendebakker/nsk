import { memo } from 'react';
import { TextField } from '@mui/material';

export default memo(
  TextField,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
