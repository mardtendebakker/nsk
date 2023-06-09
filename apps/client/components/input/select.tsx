import { MenuItem, TextFieldProps } from '@mui/material';
import TextField from './textField';

type Option = { title: string, value: number | string };
type Options = { options: Option[] };
export type Props = TextFieldProps & Options;

export default function Select({
  label, sx, fullWidth, options = [], placeholder, name,
} : Props) {
  return (
    <TextField
      fullWidth={fullWidth}
      select
      name={name}
      label={label}
      sx={{ ...sx }}
      defaultValue={0}
      inputProps={
        { sx: { color: '#B7C2D1' } }
}
    >
      {placeholder && (
      <option value={0} disabled>
        {placeholder}
      </option>
      )}
      {options.map(({ title, value }) => (
        <MenuItem value={value}>
          {title}
        </MenuItem>
      ))}
    </TextField>
  );
}
