import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers';
import { TextFieldProps } from '@mui/material';
import TextField from './textField';

export default function DatePicker({
  placeholder, onChange, renderInput, ...rest
}: DesktopDatePickerProps<Date, Date> & { placeholder?:string, renderInput?: (props: TextFieldProps) => React.ReactElement }) {
  return (
    <DesktopDatePicker
      {...rest}
      inputFormat="yyyy/MM/dd"
      onChange={(value) => {
        if (!value) {
          onChange(undefined);
        } else {
          const date = new Date(value.toString());
          if (date.toString() != 'Invalid Date') {
            onChange(value);
          }
        }
      }}
      renderInput={renderInput || ((params) => (
        <TextField
          placeholder={placeholder}
          fullWidth
          size="small"
          {...params}
          inputProps={{
            ...params.inputProps,
            placeholder,
          }}
          sx={{
            fieldset: {
              display: 'none',
            },
          }}
        />
      ))}
    />
  );
}
