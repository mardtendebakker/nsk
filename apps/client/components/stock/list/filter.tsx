import { Box } from '@mui/material';
import BorderedBox from '../../borderedBox';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import {
  AUTOCOMPLETE_PRODUCT_TYPES_PATH, AUTOCOMPLETE_LOCATIONS_PATH, AUTOCOMPLETE_PRODUCT_STATUSES_PATH, AUTOCOMPLETE_LOCATION_LABELS_PATH,
} from '../../../utils/axios';
import SearchAccordion from '../../searchAccordion';
import useResponsive from '../../../hooks/useResponsive';
import ListFilterDivider from '../../listFilterDivider';

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
        disabled={disabled}
        onSearchChange={(value: string) => setValue({ field: 'search', value })}
        searchValue={formRepresentation.search.value?.toString() || ''}
        onReset={onReset}
        searchLabel={trans('searchBySerialNumberOrNameOrAttr')}
      >
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: isDesktop ? 'unset' : 'column',
        }}
        >
          <DataSourcePicker
            path={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
            disabled={disabled}
            fullWidth
            displayFieldset={false}
            placeholder={trans('productType')}
            onChange={(selected: { id: number }) => setValue({ field: 'productType', value: selected?.id })}
            value={formRepresentation.productType.value?.toString()}
          />
          <ListFilterDivider horizontal={!isDesktop} />
          <DataSourcePicker
            path={AUTOCOMPLETE_LOCATIONS_PATH}
            searchKey="name"
            disabled={disabled}
            fullWidth
            displayFieldset={false}
            placeholder={trans('location')}
            onChange={(selected: { id: number }) => {
              setValue({ field: 'location', value: selected?.id });
              setValue({ field: 'locationLabel', value: undefined });
            }}
            value={formRepresentation.location.value?.toString()}
          />
          <ListFilterDivider horizontal={!isDesktop} />
          <DataSourcePicker
            params={{ location_id: formRepresentation.location.value?.toString() }}
            path={AUTOCOMPLETE_LOCATION_LABELS_PATH}
            disabled={disabled || !formRepresentation.location.value?.toString()}
            fullWidth
            displayFieldset={false}
            placeholder={trans('locationLabel')}
            onChange={(selected: { id: number }) => setValue({ field: 'locationLabel', value: selected?.id })}
            value={formRepresentation.locationLabel?.value?.toString()}
          />
          <ListFilterDivider horizontal={!isDesktop} />
          <DataSourcePicker
            path={AUTOCOMPLETE_PRODUCT_STATUSES_PATH}
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
  );
}
