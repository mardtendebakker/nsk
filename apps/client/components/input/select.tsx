import { MenuItem, TextFieldProps } from '@mui/material';
import TextField from './textField';

type Option = { title: string, value: number | string };
type Options = { options: Option[] };
export type Props = TextFieldProps & Options;

export default function Select({
  label, sx, fullWidth, options = [], placeholder, onChange, value, defaultValue,
} : Props) {
  return (
    <TextField
      fullWidth={fullWidth}
      select
      label={label}
      sx={{ ...sx }}
      value={placeholder && (value === undefined || value === null) ? 'none' : value}
      onChange={onChange}
      defaultValue={placeholder ? 'none' : defaultValue}
    >
      {placeholder && (
      <option value="none" disabled style={{ color: '#B7C2D1', padding: '1rem .5rem' }}>
        {placeholder}
      </option>
      )}
      {options.map(({ title, value: optionValue }) => (
        <MenuItem value={optionValue} key={title}>
          {title}
        </MenuItem>
      ))}
    </TextField>
  );
}
