import { Box } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import { useRef } from 'react';
import MemoizedTextField from '../../../memoizedInput/textField';
import Autocomplete from '../../../memoizedInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../input/textField';
import BorderedBox from '../../../borderedBox';
import SearchAccordion from '../../../searchAccordion';
import debounce from '../../../../utils/debounce';

export default function Filter({
  disabled,
  formRepresentation,
  setValue,
  onReset,
}: {
  disabled: boolean,
  formRepresentation : FormRepresentation,
  setValue: SetValue,
  onReset: () => void
}) {
  const representativeInputRef = useRef<HTMLInputElement>(null);
  const { trans } = useTranslation();
  const debouncedSetValue = debounce(setValue.bind(null));

  const handleReset = () => {
    onReset();
    representativeInputRef.current.value = '';
  };

  return (
    <form>
      <BorderedBox>
        <SearchAccordion
          searchLabel={trans('searchByCustomerNameOrEmail')}
          disabled={disabled}
          onSearchChange={(value: string) => setValue({ field: 'search', value })}
          searchValue={formRepresentation.search.value?.toString() || ''}
          onReset={handleReset}
        >
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Autocomplete
              disabled={disabled}
              fullWidth
              size="small"
              options={[]}
              filterSelectedOptions
              renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('list')}
                    sx={{
                      fieldset: {
                        display: 'none',
                      },
                    }}
                  />
                )
            }
            />
            <Box sx={(theme) => ({
              m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
            })}
            />
            <Autocomplete
              disabled={disabled}
              fullWidth
              size="small"
              options={[]}
            /*
            onChange={
            (_, option) => setValue({
               field: 'status', value: option?.id === undefined ? null : option.id }
               )}
           */
              value={[].find(({ id }) => id === formRepresentation.status.value) || null}
                // isOptionEqualToValue={(option, value) => option.id === value?.id}
              filterSelectedOptions
              renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('tags')}
                    sx={{
                      fieldset: {
                        display: 'none',
                      },
                    }}
                  />
                )
            }
            />
            <Box sx={(theme) => ({
              m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
            })}
            />
            <MemoizedTextField
              inputRef={representativeInputRef}
              disabled={disabled}
              name="search"
              placeholder={trans('representative')}
              fullWidth
              defaultValue={formRepresentation.representative.value || ''}
              onChange={(e) => debouncedSetValue({ field: 'representative', value: e.target.value })}
              type="text"
              sx={{
                fieldset: {
                  display: 'none',
                },
              }}
            />
            <Box sx={(theme) => ({
              m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
            })}
            />
            <DesktopDatePicker
              disabled={disabled}
              inputFormat="YYYY/MM/DD"
              value={formRepresentation.createdAt.value}
              onChange={(value) => setValue({ field: 'createdAt', value: moment(value.toString()).format('YYYY/MM/DD') })}
              renderInput={(params) => (
                <TextField
                  placeholder={trans('createdAt')}
                  fullWidth
                  size="small"
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: trans('createdAt'),
                  }}
                  sx={{
                    fieldset: {
                      display: 'none',
                    },
                  }}
                />
              )}
            />
          </Box>
        </SearchAccordion>
      </BorderedBox>
    </form>
  );
}
