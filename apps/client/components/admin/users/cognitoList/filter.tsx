import { Box } from '@mui/material';
import { format } from 'date-fns';
import Autocomplete from '../../../memoizedInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../input/textField';
import BorderedBox from '../../../borderedBox';
import SearchAccordion from '../../../searchAccordion';
import useResponsive from '../../../../hooks/useResponsive';
import ListFilterDivider from '../../../listFilterDivider';
import DatePicker from '../../../input/datePicker';

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
          <DatePicker
            disabled={disabled}
            value={formRepresentation.createdAt.value}
            placeholder={trans('createdAt')}
            onChange={(value) => {
              if (!value) {
                setValue({ field: 'createdAt', value });
              } else {
                setValue({ field: 'createdAt', value: format(new Date(value.toString()), 'yyyy/MM/dd') });
              }
            }}
          />
        </Box>
      </SearchAccordion>
    </BorderedBox>
  );
}
