import { Box } from '@mui/material';
import BorderedBox from '../../../borderedBox';
import Autocomplete from '../../../memoizedInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../input/textField';
import DataSourcePicker from '../../../memoizedInput/dataSourcePicker';
import { PRODUCT_TYPES_PATH, LOCATIONS_PATH, PRODUCT_STATUSES_PATH } from '../../../../utils/axios/paths';
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
          disabled={disabled}
          onSearchChanged={(value: string) => setValue({ field: 'search', value })}
          searchValue={formRepresentation.search.value?.toString()}
          onReset={onReset}
        >
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <DataSourcePicker
              url={PRODUCT_TYPES_PATH.replace(':id', '')}
              disabled={disabled}
              fullWidth
              displayFieldset={false}
              placeholder={trans('productType')}
              onChange={(selected: { id: number }) => setValue({ field: 'productType', value: selected?.id })}
              value={formRepresentation.productType.value?.toString()}
            />
            <Box sx={(theme) => ({
              m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
            })}
            />
            <DataSourcePicker
              url={LOCATIONS_PATH.replace(':id', '')}
              disabled={disabled}
              fullWidth
              displayFieldset={false}
              placeholder={trans('location')}
              onChange={(selected: { id: number }) => setValue({ field: 'location', value: selected?.id })}
              value={formRepresentation.location.value?.toString()}
            />
            <Box sx={(theme) => ({
              m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
            })}
            />
            <DataSourcePicker
              url={PRODUCT_STATUSES_PATH.replace(':id', '')}
              disabled={disabled}
              fullWidth
              displayFieldset={false}
              placeholder={trans('productStatus')}
              onChange={(selected: { id: number }) => setValue({ field: 'productStatus', value: selected?.id })}
              value={formRepresentation.productStatus.value?.toString()}
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
              value={[].find(({ id }) => id === formRepresentation.assignedTo.value) || null}
                // isOptionEqualToValue={(option, value) => option.id === value?.id}
              filterSelectedOptions
              renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('assignedTo')}
                    sx={{
                      fieldset: {
                        display: 'none',
                      },
                    }}
                  />
                )
            }
            />
          </Box>
        </SearchAccordion>
      </BorderedBox>
    </form>
  );
}
