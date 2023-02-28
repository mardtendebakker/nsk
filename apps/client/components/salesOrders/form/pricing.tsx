import {
  Box,
  Checkbox, FormControlLabel, Stack, Typography,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import TextField from '../../memoizedFormInput/TextField';
import { Field, SetValue } from '../../../hooks/useForm';

function Pricing({
  transport,
  discount,
  setValue,
}:
{ transport: Field, discount: Field, setValue: SetValue }) {
  const { trans } = useTranslation();

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        {trans('pricing')}
      </Typography>
      <Stack spacing={1}>
        <TextField
          error={!!transport.error}
          helperText={transport.error}
          label={trans('transport')}
          onChange={(e) => setValue({ field: 'transport', value: parseFloat(e.target.value).toFixed(2) })}
          value={transport.value}
          type="number"
        />
        <TextField
          error={!!discount.error}
          helperText={discount.error}
          label={trans('discount')}
          onChange={(e) => setValue({ field: 'discount', value: parseFloat(e.target.value).toFixed(2) })}
          value={discount.value}
          type="number"
        />
        <Typography
          variant="h6"
          gutterBottom
        >
          {trans('total')}
          {' '}
          €
          {' '}
          {parseFloat('0').toFixed(2)}
        </Typography>
        <FormControlLabel control={<Checkbox defaultChecked />} label={trans('isGift')} />
      </Stack>
    </>
  );
}

export default Pricing;
