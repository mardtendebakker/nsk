import {
  Box,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../hooks/useForm';
import TextField from '../memoizedInput/textField';
import useResponsive from '../../hooks/useResponsive';
import DataSourcePicker from '../memoizedInput/dataSourcePicker';
import Checkbox from '../checkbox';
import Can from '../can';
import { AUTOCOMPLETE_PARTNERS_PATH, AUTOCOMPLETE_VAT_CODES_PATH } from '../../utils/axios';

function Form({ formRepresentation, disabled, setValue }: {
  formRepresentation : FormRepresentation,
  disabled: boolean,
  setValue: SetValue,
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  return (
    <CardContent>
      <Typography
        sx={{ mb: '2rem' }}
        variant="h4"
      >
        {trans('basicDetails')}
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
        >
          <TextField
            sx={{ flex: 0.33 }}
            error={Boolean(formRepresentation.name.error)}
            helperText={formRepresentation.name.error}
            label={trans('companyForm.name.label')}
            placeholder={trans('companyForm.name.placeholder')}
            name="name"
            onChange={(e) => setValue({ field: 'name', value: e.target.value })}
            value={formRepresentation.name.value || ''}
            disabled={disabled}
          />
          <Box sx={{ m: '.25rem' }} />
          <TextField
            sx={{ flex: 0.33 }}
            type="number"
            error={Boolean(formRepresentation.kvk_nr.error)}
            helperText={formRepresentation.kvk_nr.error}
            label={trans('companyForm.kvk_nr.label')}
            placeholder={trans('companyForm.kvk_nr.placeholder')}
            name="kvk_nr"
            onChange={(e) => setValue({ field: 'kvk_nr', value: e.target.value })}
            value={formRepresentation.kvk_nr.value || ''}
            disabled={disabled}
          />
          <Can requiredGroups={['admin', 'manager', 'logistics', 'local']}>
            <Box sx={{ m: '.25rem' }} />
            <Box sx={{ flex: 0.33, display: 'flex' }}>
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
          </Can>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
        >
          <Can requiredGroups={['admin', 'manager', 'logistics', 'local']}>
            {!formRepresentation.is_partner.value && (
            <DataSourcePicker
              sx={{ flex: 0.33 }}
              label={trans('partner')}
              path={AUTOCOMPLETE_PARTNERS_PATH}
              disabled={disabled}
              fullWidth
              placeholder={trans('selectPartner')}
              value={formRepresentation.partner.value}
              onChange={(value: { id: number }) => setValue({ field: 'partner', value: value?.id || null })}
            />
            )}
            <Box sx={{ m: '.25rem' }} />
            <DataSourcePicker
              sx={{ flex: 0.33 }}
              label={trans('vat')}
              path={AUTOCOMPLETE_VAT_CODES_PATH}
              disabled={disabled}
              fullWidth
              placeholder={trans('selectVat')}
              value={formRepresentation.vat_code.value}
              onChange={(value: { id: number }) => setValue({ field: 'vat_code', value: value?.id || null })}
              error={Boolean(formRepresentation.vat_code.error)}
              helperText={formRepresentation.vat_code.error}
            />
            <Box sx={{ m: '.25rem' }} />
          </Can>
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default Form;
