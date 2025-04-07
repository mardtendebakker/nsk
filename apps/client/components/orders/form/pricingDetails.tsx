import {
  Box,
  Grid,
  Typography,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import Checkbox from '../../checkbox';
import useResponsive from '../../../hooks/useResponsive';

export default function PricingDetails({
  formRepresentation,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled: boolean,
  setValue: SetValue
}) {
  const isDesktop = useResponsive('up', 'md');
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
          sx={{
            display: 'flex', flex: 1, flexDirection: !isDesktop ? 'column' : undefined,
          }}
        >
          <TextField
            disabled={disabled}
            sx={{ width: isDesktop ? '10rem' : undefined }}
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
            sx={{ width: isDesktop ? '10rem' : undefined }}
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
        <Grid item sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            sx={{ width: isDesktop ? '10rem' : undefined }}
            label={trans('priceInclVat')}
            placeholder="0.00"
            type="number"
            value={(formRepresentation.totalPrice.value || 0 as number).toFixed(2)}
          />
          <TextField
            sx={{ width: isDesktop ? '10rem' : undefined }}
            label={trans('priceExclVat')}
            placeholder="0.00"
            type="number"
            value={(formRepresentation.totalPriceExtVat.value || 0 as number).toFixed(2)}
          />
          <TextField
            fullWidth={!isDesktop}
            sx={{ width: isDesktop ? '10rem' : undefined }}
            label={trans('vat')}
            placeholder="0.00"
            type="number"
            value={(formRepresentation.vatValue.value || 0 as number).toFixed(2)}
          />
        </Grid>
      </Grid>
    </>
  );
}
