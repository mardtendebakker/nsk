import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  TextField as BaseTextField, IconButton, InputAdornment, TextFieldProps,
} from '@mui/material';
import { useState } from 'react';

export default function SensitiveTextInput({ size = 'small', sx, ...rest }: TextFieldProps) {
  const [showText, setShowText] = useState(false);

  return (
    <BaseTextField
      {...rest}
      size={size}
      sx={{
        ...sx,
        legend: { width: 0 },
      }}
      InputLabelProps={{
        shrink: true,
        sx: { transform: 'unset', position: 'relative', mb: '.5rem' },
      }}
      type={showText ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowText(!showText)}
              edge="end"
            >
              {showText ? <RemoveRedEye /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
