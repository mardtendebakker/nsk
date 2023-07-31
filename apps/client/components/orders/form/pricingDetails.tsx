import {
  Grid,
  Typography,
  Box,
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
    <Box sx={{ flex: 1 }}>
      <Typography
        sx={{ mb: '1rem' }}
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
            disabled={disabled}
            sx={{ flex: 0.33, mr: '1rem' }}
            label={trans('transportCost')}
            placeholder="0.00"
            type="number"
            onChange={(e) => setValue({ field: 'transport', value: e.target.value })}
            value={formRepresentation.transport.value || ''}
          />
          <TextField
            disabled={disabled}
            sx={{ flex: 0.33, mr: '1rem' }}
            label={trans('discount')}
            placeholder="0.00"
            type="number"
            onChange={(e) => setValue({ field: 'discount', value: e.target.value })}
            value={formRepresentation.discount.value || ''}
          />
          <Checkbox
            disabled={disabled}
            onCheck={(checked) => setValue({ field: 'isGift', value: checked })}
            checked={formRepresentation.isGift.value as boolean}
            label={trans('gift')}
          />
        </Grid>
        <Grid item>
          <Typography variant="h3">
            {trans('total')}
            :
            {' '}
            {
                  ((formRepresentation.transport.value || 0 as number)
                   - (formRepresentation.discount.value || 0 as number)).toFixed(2)
                  }
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
