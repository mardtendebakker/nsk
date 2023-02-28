import { Stack, TextField as BaseTextField, Typography } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import TextField from '../../memoizedFormInput/TextField';
import { Field, SetValue } from '../../../hooks/useForm';
import Autocomplete from '../../memoizedFormInput/Autocomplete';

function Details({
  order_nr,
  order_date,
  remarks,
  setValue,
}:
{ order_nr: Field, order_date:Field, remarks: Field, setValue: SetValue }) {
  const { trans } = useTranslation();

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        {trans('orderDetails')}
      </Typography>
      <Stack spacing={1}>
        <TextField
          error={!!order_nr.error}
          helperText={order_nr.error}
          label={trans('orderNumber')}
          onChange={(e) => setValue({ field: 'order_nr', value: e.target.value })}
          value={order_nr.value}
        />
        <TextField
          id="date"
          label={trans('orderDate')}
          type="date"
          onChange={(e) => setValue({ field: 'order_date', value: e.target.value })}
          value={order_date.value}
        />
        <Autocomplete
          disablePortal
          options={[]}
        // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <BaseTextField {...params} label={trans('status')} />}
        />
        <TextField
          error={!!remarks.error}
          helperText={remarks.error}
          label={trans('remarks')}
          onChange={(e) => setValue({ field: 'remarks', value: e.target.value })}
          value={remarks.value}
          multiline
          maxRows={5}
          minRows={5}
        />
      </Stack>
    </>
  );
}

export default Details;
