import { Box } from '@mui/material';
import BorderedBox from '../../borderedBox';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { PRODUCT_TYPES_PATH, LOCATIONS_PATH, PRODUCT_STATUSES_PATH } from '../../../utils/axios';
import SearchAccordion from '../../searchAccordion';

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
          onSearchChange={(value: string) => setValue({ field: 'search', value })}
          searchValue={formRepresentation.search.value?.toString() || ''}
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
            <Box sx={(theme) => ({ width: '1px', height: '2.5rem', background: theme.palette.divider })} />
            <DataSourcePicker
              url={LOCATIONS_PATH.replace(':id', '')}
              disabled={disabled}
              fullWidth
              displayFieldset={false}
              placeholder={trans('location')}
              onChange={(selected: { id: number }) => setValue({ field: 'location', value: selected?.id })}
              value={formRepresentation.location.value?.toString()}
            />
            <Box sx={(theme) => ({ width: '1px', height: '2.5rem', background: theme.palette.divider })} />
            <DataSourcePicker
              url={PRODUCT_STATUSES_PATH.replace(':id', '')}
              disabled={disabled}
              fullWidth
              displayFieldset={false}
              placeholder={trans('productStatus')}
              onChange={(selected: { id: number }) => setValue({ field: 'productStatus', value: selected?.id })}
              value={formRepresentation.productStatus.value?.toString()}
            />
          </Box>
        </SearchAccordion>
      </BorderedBox>
    </form>
  );
}
