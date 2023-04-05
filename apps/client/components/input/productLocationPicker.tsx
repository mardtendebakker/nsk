import { SxProps } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import TextField from './textField';
import Autocomplete from '../memoizedInput/autocomplete';

export default function ProductLocationPicker(
  {
    disabled, value, sx, fullWidth, label, placeholder, displayFieldset,
  }: {
    disabled?: boolean,
    value?: number,
    sx?: SxProps,
    fullWidth?: boolean,
    label?: string,
    placeholder?: string,
    displayFieldset?: boolean
  },
) {
  const { trans } = useTranslation();

  return (
    <Autocomplete
      fullWidth={fullWidth}
      disabled={disabled}
      size="small"
      sx={sx}
      options={[]}
      value={[].find(({ id }) => id === value) || null}
      filterSelectedOptions
      renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={typeof placeholder === 'string' ? placeholder : trans('location')}
                    label={typeof label === 'string' ? label : trans('location')}
                    sx={{
                      fieldset: {
                        display: !displayFieldset && 'none',
                      },
                    }}
                  />
                )
      }
    />
  );
}

ProductLocationPicker.defaultProps = {
  disabled: false,
  value: undefined,
  sx: undefined,
  fullWidth: undefined,
  label: undefined,
  placeholder: undefined,
  displayFieldset: true,
};
