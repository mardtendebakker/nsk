import { Box } from '@mui/material';
import { useRef } from 'react';
import MemoizedTextField from '../../memoizedInput/textField';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import BorderedBox from '../../borderedBox';
import SearchAccordion from '../../searchAccordion';
import debounce from '../../../utils/debounce';
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
  const companyInputRef = useRef<HTMLInputElement>(null);
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'sm');
  const debouncedSetValue = debounce(setValue.bind(null));

  const handleReset = () => {
    onReset();
    if (!formRepresentation.company.disabled) { companyInputRef.current.value = ''; }
  };

  return (
    <BorderedBox>
      <SearchAccordion
        searchLabel={trans('searchByCustomerNameOrEmail')}
        disabled={disabled}
        onSearchChange={(value: string) => setValue({ field: 'search', value })}
        searchValue={formRepresentation.search.value?.toString() || ''}
        onReset={handleReset}
        disabledFilter={formRepresentation.company.disabled}
      >
        {!formRepresentation.company.disabled
        && (
        <Box sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: isDesktop ? undefined : 'column',
        }}
        >
          <MemoizedTextField
            inputRef={companyInputRef}
            disabled={disabled || formRepresentation.company?.disabled}
            name="search"
            placeholder={trans('company')}
            fullWidth
            defaultValue={formRepresentation.company.value || ''}
            onChange={(e) => debouncedSetValue({ field: 'company', value: e.target.value })}
            type="text"
            sx={{
              flex: 0.5,
              fieldset: {
                display: 'none',
              },
            }}
          />
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
