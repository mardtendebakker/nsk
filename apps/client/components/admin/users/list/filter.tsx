import { Box } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import Autocomplete from '../../../memoizedInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../input/textField';
import BorderedBox from '../../../borderedBox';
import SearchAccordion from '../../../searchAccordion';

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
  const { trans } = useTranslation();

  return (
    <form>
      <BorderedBox>
        <SearchAccordion
          searchLabel={trans('searchByCustomerNameOrEmail')}
          disabled={disabled}
          onSearchChange={(value: string) => setValue({ field: 'search', value })}
          searchValue={formRepresentation.search.value?.toString()}
          onReset={onReset}
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
                    placeholder={trans('lastActive')}
                    sx={{
                      fieldset: {
                        display: 'none',
                      },
                    }}
                  />
                )
            }
            />
            <Box sx={(theme) => ({ width: '1px', height: '2.5rem', background: theme.palette.divider })} />
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
                    placeholder={trans('createdBy')}
                    sx={{
                      fieldset: {
                        display: 'none',
                      },
                    }}
                  />
                )
            }
            />
            <Box sx={(theme) => ({ width: '1px', height: '2.5rem', background: theme.palette.divider })} />
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
