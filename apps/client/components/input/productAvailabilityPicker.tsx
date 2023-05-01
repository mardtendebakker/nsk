import { SxProps } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import TextField from './textField';
import Autocomplete from '../memoizedInput/autocomplete';

type Availability = 'inStock' | 'onHold' | 'saleable' | 'sold';
type Option = { id: Availability, label: string };

export default function ProductAvailabilityPicker(
  {
    disabled, value, sx, fullWidth, label, placeholder, displayFieldset, onChange,
  }: {
    disabled?: boolean,
    value?: string,
    sx?: SxProps,
    fullWidth?: boolean,
    label?: string,
    placeholder?: string,
    displayFieldset?: boolean,
    onChange: (arg0: Option) => void
  },
) {
  const { trans } = useTranslation();

  const OPTIONS: Option[] = [
    { id: 'inStock', label: trans('inStock') },
    { id: 'onHold', label: trans('onHold') },
    { id: 'saleable', label: trans('saleable') },
    { id: 'sold', label: trans('sold') },
  ];

  return (
    <Autocomplete
      fullWidth={fullWidth}
      disabled={disabled}
      size="small"
      sx={sx}
      options={OPTIONS}
      value={OPTIONS.find(({ id }) => id == value) || null}
      filterSelectedOptions
      onChange={(_, selected: Option) => onChange(selected)}
      renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={typeof placeholder === 'string' ? placeholder : trans('availability')}
                    label={typeof label === 'string' ? label : trans('availability')}
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

ProductAvailabilityPicker.defaultProps = {
  disabled: false,
  value: undefined,
  sx: undefined,
  fullWidth: undefined,
  label: undefined,
  placeholder: undefined,
  displayFieldset: true,
};
