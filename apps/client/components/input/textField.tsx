import { TextField as BaseTextField, TextFieldProps } from '@mui/material';

export default function TextField({ size = 'small', sx, ...rest }: TextFieldProps) {
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
    />
  );
}
