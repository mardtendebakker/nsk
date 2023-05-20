import {
  CardContent,
  Checkbox,
  Divider,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import { SyntheticEvent } from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import BaseTextField from '../../input/textField';
import SupplierTypePicker from './supplierTypePicker';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { ORDER_STATUSES_PATH, SUPPLIERS_PATH } from '../../../utils/axios';

function Form({
  formRepresentation,
  disabled,
  onSubmit,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  onSubmit: (e: SyntheticEvent) => void,
  setValue: SetValue
}) {
  const { trans } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <CardContent>
        <Typography
          sx={{ mb: '2rem' }}
          variant="h4"
        >
          {trans('basicDetails')}
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 1, mr: '1rem' }}
              label={trans('orderForm.orderNr.label')}
              placeholder={trans('orderForm.orderNr.placeholder')}
              name="orderNr"
              onChange={(e) => setValue({ field: 'orderNr', value: e.target.value })}
              value={formRepresentation.orderNr.value || ''}
              error={!!formRepresentation.orderNr.error}
              helperText={formRepresentation.orderNr.error}
            />
            <DesktopDatePicker
              onChange={(value) => setValue({ field: 'orderDate', value })}
              value={formRepresentation.orderDate.value}
              inputFormat="YYYY/MM/DD"
              label={trans('orderDate')}
              renderInput={(params) => (
                <BaseTextField
                  error={!!formRepresentation.orderDate.error}
                  helperText={formRepresentation.orderDate.error}
                  sx={{ flex: 1, mr: '1rem' }}
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: trans('selectOrderDate'),
                  }}
                />
              )}
            />
            <DataSourcePicker
              sx={{ flex: 1 }}
              url={ORDER_STATUSES_PATH.replace(':id', '')}
              disabled={disabled}
              fullWidth
              placeholder={trans('selectStatus')}
              label={trans('orderStatus')}
              onChange={(selected: { id: number }) => setValue({ field: 'orderStatus', value: selected?.id })}
              value={formRepresentation.orderStatus.value}
              error={!!formRepresentation.orderStatus.error}
              helperText={formRepresentation.orderStatus.error}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              fullWidth
              size="medium"
              multiline
              rows={3}
              label={trans('remarks')}
              placeholder={trans('remarks')}
              name="remarks"
              type="text"
              onChange={(e) => setValue({ field: 'remarks', value: e.target.value })}
              value={formRepresentation.remarks.value || ''}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex' }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('pricingDetails')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
            >
              <TextField
                sx={{ flex: 0.33, mr: '1rem' }}
                label={trans('transportCost')}
                placeholder="0.00"
                type="number"
                onChange={(e) => setValue({ field: 'transportCost', value: e.target.value })}
                value={formRepresentation.transportCost.value}
              />
              <TextField
                sx={{ flex: 0.33, mr: '1rem' }}
                label={trans('discount')}
                placeholder="0.00"
                type="number"
                onChange={(e) => setValue({ field: 'discount', value: e.target.value })}
                value={formRepresentation.discount.value}
              />
              <Checkbox
                sx={{ m: 'revert', mb: '.4rem', alignSelf: 'end' }}
                onChange={(_, checked) => setValue({ field: 'isGift', value: checked })}
                checked={formRepresentation.isGift.value as boolean}
              />
              <Typography variant="inherit" sx={{ mt: '1.9rem' }}>
                {trans('isAGift')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h3">
                {trans('total')}
                :
                {' '}
                {
                  ((formRepresentation.transportCost.value as number)
                   - (formRepresentation.discount.value as number)).toFixed(2)
                  }
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('supplierDetails')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
            >
              <SupplierTypePicker
                onChange={(value) => setValue({ field: 'newSupplier', value: value == 'new' })}
                value={formRepresentation.newSupplier.value ? 'new' : 'existing'}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column',
              }}
            >
              {formRepresentation.newSupplier.value ? (
                <>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex', mb: '1rem', width: '100%',
                    }}
                  >
                    <TextField
                      sx={{ mr: '1rem' }}
                      fullWidth
                      label={trans('name')}
                      placeholder={trans('name')}
                      onChange={(e) => setValue({ field: 'name', value: e.target.value })}
                      value={formRepresentation.name.value || ''}
                      error={!!formRepresentation.name.error}
                      helperText={formRepresentation.name.error}
                    />
                    <TextField
                      sx={{ mr: '1rem' }}
                      fullWidth
                      label={trans('kvkNr')}
                      placeholder={trans('kvkNr')}
                      onChange={(e) => setValue({ field: 'kvkNr', value: e.target.value })}
                      value={formRepresentation.kvkNr.value || ''}
                    />
                    <TextField
                      sx={{ mr: '1rem' }}
                      fullWidth
                      label={trans('representative')}
                      placeholder={trans('representative')}
                      onChange={(e) => setValue({ field: 'representative', value: e.target.value })}
                      value={formRepresentation.representative.value || ''}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex', mb: '1rem', width: '100%',
                    }}
                  />
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex', mb: '1rem', width: '100%',
                    }}
                  >
                    <TextField
                      sx={{ mr: '1rem' }}
                      fullWidth
                      label={trans('email')}
                      placeholder={trans('example@email.com')}
                      type="email"
                      onChange={(e) => setValue({ field: 'email', value: e.target.value })}
                      value={formRepresentation.email.value || ''}
                      error={!!formRepresentation.email.error}
                      helperText={formRepresentation.email.error}
                    />
                    <TextField
                      fullWidth
                      label={trans('phone')}
                      placeholder={trans('0000000000')}
                      onChange={(e) => setValue({ field: 'phone', value: e.target.value })}
                      value={formRepresentation.phone.value || ''}
                      error={!!formRepresentation.phone.error}
                      helperText={formRepresentation.phone.error}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex', mb: '1rem', width: '100%',
                    }}
                  >
                    <TextField
                      fullWidth
                      sx={{ mr: '1rem' }}
                      label={trans('street')}
                      placeholder={trans('street')}
                      onChange={(e) => setValue({ field: 'street', value: e.target.value })}
                      value={formRepresentation.street.value || ''}
                      error={!!formRepresentation.street.error}
                      helperText={formRepresentation.street.error}
                    />
                    <TextField
                      sx={{ mr: '1rem' }}
                      fullWidth
                      label={trans('extraStreet')}
                      placeholder={trans('extraStreet')}
                      onChange={(e) => setValue({ field: 'extraStreet', value: e.target.value })}
                      value={formRepresentation.extraStreet.value || ''}
                      error={!!formRepresentation.extraStreet.error}
                      helperText={formRepresentation.extraStreet.error}
                    />
                    <TextField
                      fullWidth
                      label={trans('city')}
                      placeholder={trans('city')}
                      onChange={(e) => setValue({ field: 'city', value: e.target.value })}
                      value={formRepresentation.city.value || ''}
                      error={!!formRepresentation.city.error}
                      helperText={formRepresentation.city.error}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex', mb: '1rem', width: '100%',
                    }}
                  >
                    <TextField
                      sx={{ mr: '1rem' }}
                      fullWidth
                      label={trans('zipcode')}
                      placeholder={trans('zipcode')}
                      onChange={(e) => setValue({ field: 'zipcode', value: e.target.value })}
                      value={formRepresentation.zipcode.value || ''}
                    />
                    <TextField
                      sx={{ mr: '1rem' }}
                      fullWidth
                      label={trans('state')}
                      placeholder={trans('state')}
                      onChange={(e) => setValue({ field: 'state', value: e.target.value })}
                      value={formRepresentation.state.value || ''}
                    />
                    <TextField
                      fullWidth
                      label={trans('country')}
                      placeholder={trans('country')}
                      onChange={(e) => setValue({ field: 'country', value: e.target.value })}
                      value={formRepresentation.country.value || ''}
                    />
                  </Grid>
                </>
              ) : (
                <DataSourcePicker
                  url={SUPPLIERS_PATH.replace(':id', '')}
                  disabled={disabled}
                  fullWidth
                  placeholder={trans('selectSupplier')}
                  onChange={(selected: { id: number }) => setValue({ field: 'supplierId', value: selected?.id })}
                  value={formRepresentation.supplierId.value?.toString() || ''}
                  error={!!formRepresentation.supplierId.error}
                  helperText={formRepresentation.supplierId.error}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </form>
  );
}

export default Form;
