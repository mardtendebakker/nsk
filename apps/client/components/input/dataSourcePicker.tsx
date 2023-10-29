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
    path,
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
    formatter?: (arg0: object) => { id: number, label: string },
    onChange: (arg0: undefined | object | object[])=>void,
    path: string,
    searchKey?: string,
    helperText?: string,
    error?: boolean,
    multiple?: boolean
  },
) {
  const { data, call } = useAxios('get', path, { showErrorMessage: false });
  const debouncedCall = useCallback(debounce(call), []);
  const [currentValue, setCurrentValue] = useState(null);

  const options = (data || []).map(formatter);

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
          ? response.data.filter((item) => !!(value as string[]).find((id) => id == item.id))
          : response.data.find((item) => item.id == value);

        if (multiple && found.length > 0) {
          setCurrentValue(ids
            .map((id) => {
              const foundItem = found.find((item) => item.id == id);
              return foundItem ? formatter(foundItem) : undefined;
            })
            .filter((item) => item));
        } else if (!multiple && found) {
          setCurrentValue(formatter(found));
        } else if (value === undefined) {
          setCurrentValue(undefined);
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
  formatter: (object): { id: number, label: string } => object,
  helperText: undefined,
  error: false,
  multiple: false,
};
