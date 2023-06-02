import { SxProps, Autocomplete } from '@mui/material';
import { useCallback, useEffect } from 'react';
import TextField from './textField';
import useAxios from '../../hooks/useAxios';
import debounce from '../../utils/debounce';
import { AxiosResponse } from '../../utils/axios';

export default function DataSourcePicker(
  {
    disabled,
    params,
    value,
    sx,
    fullWidth,
    label,
    placeholder,
    displayFieldset,
    formatter,
    onChange,
    url,
    searchKey,
    helperText,
    error,
  }: {
    disabled?: boolean,
    params?: { [key: string]: string },
    value?: string,
    sx?: SxProps,
    fullWidth?: boolean,
    label?: string,
    placeholder?: string,
    displayFieldset?: boolean,
    formatter?: (arg0: object) => object,
    onChange: (arg0: object)=>void,
    url: string,
    searchKey?: string,
    helperText?: string,
    error?: boolean
  },
) {
  const { data, call } = useAxios('get', url, { showErrorMessage: false });
  const debouncedCall = useCallback(debounce(call), []);

  let options = data?.data || [];
  if (formatter) {
    options = options.map(formatter);
  }

  useEffect(() => {
    call({ params }).then((response: AxiosResponse) => {
      if (response?.data) {
        const found = response.data.data.find((item) => item.id == value);
        if (found) {
          onChange(found);
        }
      }
    });
  }, [value]);

  return (
    <Autocomplete
      fullWidth={fullWidth}
      disabled={disabled}
      size="small"
      sx={sx}
      options={options}
      value={options.find(({ id }) => id == value) || null}
      onChange={(_, selected: { id: number }) => onChange(selected)}
      filterSelectedOptions
      renderInput={
                (inputParams) => (
                  <TextField
                    helperText={helperText}
                    error={error}
                    {...inputParams}
                    placeholder={placeholder}
                    label={label}
                    sx={{
                      fieldset: {
                        display: !displayFieldset && 'none',
                      },
                    }}
                    onBlur={() => {
                      debouncedCall();
                    }}
                    onChange={(e) => {
                      debouncedCall({
                        params: { [searchKey]: e.target.value, ...params },
                      });
                    }}
                  />
                )
      }
    />
  );
}

DataSourcePicker.defaultProps = {
  searchKey: 'nameContains',
  params: {},
  disabled: false,
  value: undefined,
  sx: undefined,
  fullWidth: undefined,
  label: undefined,
  placeholder: undefined,
  displayFieldset: true,
  formatter: ({ id, name, ...rest }) => ({ id, label: name, ...rest }),
  helperText: undefined,
  error: false,
};
