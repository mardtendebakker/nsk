import { useRef } from 'react';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import BorderedBox from '../../borderedBox';
import SearchAccordion from '../../searchAccordion';
import useResponsive from '../../../hooks/useResponsive';
import Checkbox from '../../checkbox';

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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'sm');

  const handleReset = () => {
    onReset();
    nameInputRef.current.value = '';
  };

  return (
    <BorderedBox>
      <SearchAccordion
        searchLabel={trans('search')}
        disabled={disabled}
        onSearchChange={(value: string) => setValue({ field: 'search', value })}
        searchValue={formRepresentation.search.value?.toString() || ''}
        onReset={handleReset}
      >
        <Box sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: isDesktop ? 'unset' : 'column',
        }}
        >
          <Box sx={{ display: 'flex' }}>
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
      </SearchAccordion>
    </BorderedBox>
  );
}
