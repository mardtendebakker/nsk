import { SxProps } from '@mui/material';
import { useCallback, useEffect } from 'react';
import TextField from './textField';
import Autocomplete from '../memoizedInput/autocomplete';
import useAxios from '../../hooks/useAxios';
import debounce from '../../utils/debounce';

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
  }: {
    disabled?: boolean,
    params?: { [key: string]: string },
    value?: any,
    sx?: SxProps,
    fullWidth?: boolean,
    label?: string,
    placeholder?: string,
    displayFieldset?: boolean,
    formatter?: (arg0: object) => object,
    onChange: (id?: number)=>void,
    url: string,
    searchKey?: string
  },
) {
  const { data, call } = useAxios('get', url, { showErrorMessage: false });
  const debouncedCall = useCallback(debounce(call), []);

  useEffect(() => {
    call({ params });
  }, []);

  let options = data?.data || [];
  if (formatter) {
    options = options.map(formatter);
  }

  return (
    <Autocomplete
      fullWidth={fullWidth}
      disabled={disabled}
      size="small"
      sx={sx}
      options={options}
      value={options.find(({ id }) => id == value) || null}
      onChange={(_, selected: { id: number }) => onChange(selected?.id)}
      filterSelectedOptions
      renderInput={
                (inputParams) => (
                  <TextField
                    {...inputParams}
                    placeholder={placeholder}
                    label={label}
                    sx={{
                      fieldset: {
                        display: !displayFieldset && 'none',
                      },
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
  formatter: ({ id, name }) => ({ id, label: name }),
};
