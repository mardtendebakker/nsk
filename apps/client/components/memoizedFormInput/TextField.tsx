import React, { memo } from 'react';
import { TextField as BaseTextField } from '@mui/material';

function TextField(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BaseTextField fullWidth variant="outlined" {...props} />;
}

export default memo(
  TextField,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
