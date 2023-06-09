import { TextField as BaseTextField, TextFieldProps } from '@mui/material';

export default function TextField({
  error,
  helperText,
  label,
  placeholder,
  name,
  onChange,
  value,
  size = 'small',
  sx,
  ...rest
}: TextFieldProps) {
  return (
    <BaseTextField
      {...rest}
      sx={{
        ...sx,
        legend: { display: 'none' },
      }}
      InputLabelProps={{
        shrink: true,
        sx: { transform: 'unset', position: 'relative', mb: '.5rem' },
      }}
      size={size}
      error={error}
      helperText={helperText}
      label={label}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      value={value}
    />
  );
}
