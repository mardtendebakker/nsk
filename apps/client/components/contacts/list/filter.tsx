import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import BorderedBox from '../../borderedBox';
import SearchAccordion from '../../searchAccordion';
import useResponsive from '../../../hooks/useResponsive';
import Checkbox from '../../checkbox';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_COMPANIES_PATH } from '../../../utils/axios';
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

  const handleReset = () => {
    onReset();
  };

  return (
    <BorderedBox>
      <SearchAccordion
        searchLabel={trans('searchByCustomerNameOrEmail')}
        disabled={disabled}
        onSearchChange={(value: string) => setValue({ field: 'search', value })}
        searchValue={formRepresentation.search.value?.toString() || ''}
        onReset={handleReset}
        disabledFilter={formRepresentation.company_id.disabled}
      >
        {!formRepresentation.company_id.disabled
        && (
        <Box sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: isDesktop ? undefined : 'column',
        }}
        >

          <DataSourcePicker
            path={AUTOCOMPLETE_COMPANIES_PATH}
            disabled={disabled}
            fullWidth
            displayFieldset={false}
            placeholder={trans('company')}
            onChange={(selected: { id: number }) => setValue({ field: 'company_id', value: selected?.id })}
            value={formRepresentation.company_id.value?.toString()}
          />
          <ListFilterDivider horizontal={!isDesktop} />
          <Box sx={{
            display: 'flex',
            flexDirection: isDesktop ? undefined : 'column',
          }}
          >
            <Checkbox
              checked={formRepresentation.is_customer.value}
              onCheck={(checked) => setValue({ field: 'is_customer', value: checked })}
              label={trans('isCustomer')}
            />
            <Checkbox
              checked={formRepresentation.is_supplier.value}
              onCheck={(checked) => setValue({ field: 'is_supplier', value: checked })}
              label={trans('isSupplier')}
            />
            <Checkbox
              checked={formRepresentation.is_partner.value}
              onCheck={(checked) => setValue({ field: 'is_partner', value: checked })}
              label={trans('isPartner')}
            />
          </Box>
        </Box>
        )}
      </SearchAccordion>
    </BorderedBox>
  );
}
