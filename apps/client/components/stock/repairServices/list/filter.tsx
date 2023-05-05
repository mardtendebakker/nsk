import { Box } from '@mui/material';
import BorderedBox from '../../../borderedBox';
import Autocomplete from '../../../memoizedInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../input/textField';
import DataSourcePicker from '../../../memoizedInput/dataSourcePicker';
import { PRODUCT_STATUSES_PATH, PRODUCT_TYPES_PATH } from '../../../../utils/axios/paths';
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

  const ORDER_BY_OPTIONS = [
    {
      id: 'order.due_date:desc',
      name: trans('dueDate'),
    },
  ];

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
              value={[].find(({ id }) => id === formRepresentation.assignedTo.value) || null}
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
            <Box sx={(theme) => ({
              m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
            })}
            />
            <Autocomplete
              disabled={disabled}
              fullWidth
              size="small"
              getOptionLabel={({ name }: { name:string }) => name}
              value={
                  ORDER_BY_OPTIONS.find(({ id }) => id == formRepresentation.orderBy.value)
                  || null
                }
              onChange={(_, selected: { id: number }) => setValue({ field: 'orderBy', value: selected?.id })}
              options={ORDER_BY_OPTIONS}
              filterSelectedOptions
              renderInput={
                (params) => (
                  <TextField
                    {...params}
                    placeholder={trans('sortBy')}
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
