import { Box } from '@mui/material';
import ProductAvailabilityPicker from '../../../memoizedInput/productAvailabilityPicker';
import BorderedBox from '../../../borderedBox';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TastStatusPicker from '../../../memoizedInput/taskStatusPicker';
import DataSourcePicker from '../../../memoizedInput/dataSourcePicker';
import { PRODUCT_TYPES_PATH, LOCATIONS_PATH } from '../../../../utils/axios/paths';
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
            <ProductAvailabilityPicker
              displayFieldset={false}
              label=""
              onChange={(selected) => setValue({ field: 'availability', value: selected?.id })}
              value={formRepresentation.availability.value?.toString()}
              fullWidth
              disabled={disabled}
            />
            <Box sx={(theme) => ({
              m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
            })}
            />
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
            <TastStatusPicker
              displayFieldset={false}
              label=""
              fullWidth
              disabled={disabled}
              value={[].find(({ id }) => id === formRepresentation.location.value) || null}
            />
          </Box>
        </SearchAccordion>
      </BorderedBox>
    </form>
  );
}
