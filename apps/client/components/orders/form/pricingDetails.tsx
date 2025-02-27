import {
  Box,
  Grid,
  Typography,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import Checkbox from '../../checkbox';

export default function PricingDetails({
  formRepresentation,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled: boolean,
  setValue: SetValue
}) {
  const { trans } = useTranslation();
  return (
    <>
      <Typography
        sx={{ mb: '1rem' }}
        variant="h4"
      >
        {trans('pricingDetails')}
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
        >
          <TextField
            disabled={disabled}
            sx={{ width: '10rem' }}
            label={trans('transportCost')}
            placeholder="0.00"
            type="number"
            onChange={(e) => {
              setValue({ field: 'transport', value: e.target.value });
              setValue({ field: 'transportInclVat', value: parseFloat(e.target.value) * formRepresentation.vatFactor.value });
            }}
            value={formRepresentation.transport.value || ''}
          />
          <Box sx={{ m: '.25rem' }} />
          <TextField
            disabled={disabled}
            sx={{ width: '10rem' }}
            label={trans('transportCostInclVat')}
            placeholder="0.00"
            type="number"
            onChange={(e) => {
              setValue({ field: 'transport', value: parseFloat(e.target.value) / formRepresentation.vatFactor.value });
              setValue({ field: 'transportInclVat', value: e.target.value });
            }}
            value={formRepresentation.transportInclVat.value || ''}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
        >
          <TextField
            disabled={disabled}
            sx={{ width: '10rem' }}
            label={trans('discount')}
            placeholder="0.00"
            type="number"
            inputProps={{ min: 0 }}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setValue({ field: 'discount', value: value < 0 || Number.isNaN(value) ? 0 : value });
            }}
            value={formRepresentation.discount.value || ''}
          />
          <Box sx={{ m: '.25rem' }} />
          <Checkbox
            disabled={disabled}
            onCheck={(checked) => setValue({ field: 'isGift', value: checked })}
            checked={formRepresentation.isGift.value as boolean}
            label={trans('gift')}
          />
        </Grid>
        <Grid item sx={{ mt: '.5rem' }}>
          <Typography variant="h4">
            {trans('total')}
            :
            {' '}
            {(formRepresentation.totalPrice.value || 0 as number).toFixed(2)}
            {' '}
            (
            {(formRepresentation.vat.value as number)}
            %
            {' '}
            {trans('vat')}
            )

          </Typography>
          <Typography variant="h4" sx={{ mt: '.5rem' }}>
            {trans('totalExtVat')}
            :
            {' '}
            {(formRepresentation.totalPriceExtVat.value || 0 as number).toFixed(2)}
          </Typography>
          <Typography variant="h4" sx={{ mt: '.5rem' }}>
            {trans('vatValue')}
            :
            {' '}
            {(formRepresentation.vatValue.value || 0 as number).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
