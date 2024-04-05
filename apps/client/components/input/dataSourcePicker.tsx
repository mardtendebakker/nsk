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
    onCurrentValueChange,
    path,
    searchKey,
    helperText,
    error,
    multiple,
    fetchOnSearch,
    fetchWhileDisabled,
  }: {
    disabled?: boolean,
    params?: { [key: string]: string | number },
    value?: string | string[],
    sx?: SxProps,
    fullWidth?: boolean,
    label?: string,
    placeholder?: string,
    displayFieldset?: boolean,
    formatter?: (arg0: object) => { id: number | string, label: string },
    onChange: (arg0: undefined | object | object[])=>void,
    onCurrentValueChange?: (arg0: undefined | object | object[])=>void,
    path: string,
    searchKey?: string,
    helperText?: string,
    error?: boolean,
    multiple?: boolean,
    fetchOnSearch?: boolean,
    fetchWhileDisabled?: boolean
  },
) {
  const { data, call } = useAxios<undefined | object[]>('get', path, { showErrorMessage: false });
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
    if (disabled && !fetchWhileDisabled) {
      return;
    }

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
    }).catch(() => {});
  }, [value?.toString(), JSON.stringify(params), disabled.toString()]);

  useEffect(() => {
    if (onCurrentValueChange) {
      onCurrentValueChange(currentValue);
    }
  }, [currentValue]);

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
      isOptionEqualToValue={(option, selectedValue) => option.id == selectedValue.id}
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
                      if (fetchOnSearch) {
                        debouncedCall({
                          params: { [searchKey]: e.target.value, ...params },
                        });
                      }
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
  onCurrentValueChange: undefined,
  displayFieldset: true,
  formatter: (object): { id: number | string, label: string } => object,
  helperText: undefined,
  error: false,
  multiple: false,
  fetchOnSearch: true,
  fetchWhileDisabled: false,
};
