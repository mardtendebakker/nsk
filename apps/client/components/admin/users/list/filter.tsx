import { Box } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { format } from 'date-fns';
import Autocomplete from '../../../memoizedInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../input/textField';
import BorderedBox from '../../../borderedBox';
import SearchAccordion from '../../../searchAccordion';
import useResponsive from '../../../../hooks/useResponsive';
import ListFilterDivider from '../../../listFilterDivider';

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
  const isDesktop = useResponsive('up', 'sm');

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
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: isDesktop ? 'unset' : 'column',
          }}
          >
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
            <ListFilterDivider horizontal={!isDesktop} />
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
            <ListFilterDivider horizontal={!isDesktop} />
            <DesktopDatePicker
              disabled={disabled}
              inputFormat="yyyy/MM/dd"
              value={formRepresentation.createdAt.value}
              onChange={(value) => setValue({ field: 'createdAt', value: format(new Date(value.toString()), 'yyyy/MM/dd') })}
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
