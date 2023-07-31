import { SxProps, Autocomplete } from '@mui/material';
import {
  useCallback, useEffect, useState,
} from 'react';
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
    multiple,
  }: {
    disabled?: boolean,
    params?: { [key: string]: string | number },
    value?: string | string[],
    sx?: SxProps,
    fullWidth?: boolean,
    label?: string,
    placeholder?: string,
    displayFieldset?: boolean,
    formatter?: (arg0: object) => object,
    onChange: (arg0: object | object[])=>void,
    url: string,
    searchKey?: string,
    helperText?: string,
    error?: boolean,
    multiple?: boolean
  },
) {
  const { data, call } = useAxios('get', url, { showErrorMessage: false });
  const debouncedCall = useCallback(debounce(call), []);
  const [currentValue, setCurrentValue] = useState(null);

  let options = data?.data || [];
  if (formatter) {
    options = options.map(formatter);
  }

  let ids;

  if (Array.isArray(value)) {
    ids = value;
  } else if (value) {
    ids = [value];
  }

  useEffect(() => {
    call({ params: { ...params, ids } }).then((response: AxiosResponse) => {
      if (response?.data) {
        const found = multiple
          ? response.data.data.filter((item) => !!(value as string[]).find((id) => id == item.id))
          : response.data.data.find((item) => item.id == value);

        if (multiple && found.length > 0) {
          setCurrentValue(found.map(formatter));
          onChange(found);
        } else if (!multiple && found) {
          setCurrentValue(formatter(found));
          onChange(found);
        }
      }
    });
  }, [value?.toString()]);

  return (
    <Autocomplete
      multiple={multiple}
      fullWidth={fullWidth}
      disabled={disabled}
      size="small"
      sx={sx}
      options={options}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      value={currentValue || (multiple ? [] : null)}
      onChange={(_, selected: { id: number } | { id: number }[]) => {
        setCurrentValue(selected);
        onChange(selected);
      }}
      filterSelectedOptions
      isOptionEqualToValue={(option, usedValue) => option.id == usedValue.id}
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
                      call({ params });
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
  searchKey: 'search',
  params: {},
  disabled: false,
  value: undefined,
  sx: undefined,
  fullWidth: undefined,
  label: undefined,
  placeholder: undefined,
  displayFieldset: true,
  formatter: ({ id, name, ...rest }) => ({
    id, label: name, name, ...rest,
  }),
  helperText: undefined,
  error: false,
  multiple: false,
};
