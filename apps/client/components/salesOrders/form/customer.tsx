import {
  Box, TextField as BaseTextField,
  Checkbox, FormControlLabel, Stack, Typography,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import TextField from '../../memoizedFormInput/TextField';
import { Field, SetValue } from '../../../hooks/useForm';
import Autocomplete from '../../memoizedFormInput/Autocomplete';

function Customer({
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
        {trans('customer')}
      </Typography>
      <Stack spacing={1}>
        <FormControlLabel control={<Checkbox defaultChecked />} label={trans('isGift')} />
        <Autocomplete
          disablePortal
          options={[]}
        // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <BaseTextField {...params} label={trans('status')} />}
        />
        <TextField
          fullWidth
          label={trans('name')}
          name="name"
          onChange={(e) => setValue({ field: 'name', value: e.target.value })}
        />
        <TextField
          fullWidth
          label={trans('kvkNr')}
          name="kvk_nr"
          onChange={(e) => setValue({ field: 'kvk_nr', value: e.target.value })}
        />
        <TextField
          fullWidth
          label={trans('representative')}
          name="representative"
          onChange={(e) => setValue({ field: 'representative', value: e.target.value })}
        />
        <TextField
          fullWidth
          label={trans('email')}
          name="email"
          onChange={(e) => setValue({ field: 'email', value: e.target.value })}
        />
        <TextField
          fullWidth
          label={trans('phone')}
          name="phone"
          onChange={(e) => setValue({ field: 'phone', value: e.target.value })}
        />
        <TextField
          fullWidth
          label={trans('street')}
          name="street"
          onChange={(e) => setValue({ field: 'street', value: e.target.value })}
        />
        <Box sx={{ mx: 0.5, my: 0.5 }} />
        <TextField
          fullWidth
          label={trans('street_extra')}
          name="street_extra"
          onChange={(e) => setValue({ field: 'street_extra', value: e.target.value })}
        />
        <TextField
          fullWidth
          label={trans('city')}
          name="city"
          onChange={(e) => setValue({ field: 'city', value: e.target.value })}
        />
        <TextField
          fullWidth
          label={trans('country')}
          name="country"
          onChange={(e) => setValue({ field: 'country', value: e.target.value })}
        />
        <Box sx={{ mx: 0.5, my: 0.5 }} />
        <TextField
          fullWidth
          label={trans('state')}
          name="state"
          onChange={(e) => setValue({ field: 'state', value: e.target.value })}
        />
        <Box sx={{ mx: 0.5, my: 0.5 }} />
        <TextField
          fullWidth
          label={trans('zipcode')}
          name="zip"
          onChange={(e) => setValue({ field: 'zip', value: e.target.value })}
        />
      </Stack>
    </>
  );
}

export default Customer;
