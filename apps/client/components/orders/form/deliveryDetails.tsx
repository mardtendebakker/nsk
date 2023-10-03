import { Box, Grid, Typography } from '@mui/material';
import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import BaseTextField from '../../input/textField';
import Select from '../../memoizedInput/select';
import TextField from '../../memoizedInput/textField';

export default function DeliveryDetails({
  formRepresentation,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Typography
        sx={{ mb: '1rem' }}
        variant="h4"
      >
        {trans('deliveryDetails')}
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{ flexDirection: 'column' }}
      >
        <Grid sx={{ display: 'flex', flexDirection: 'column' }} item>
          <DesktopDateTimePicker
            disabled={disabled}
            onChange={(value) => setValue({ field: 'deliveryDate', value })}
            value={formRepresentation.deliveryDate.value || null}
            inputFormat="yyyy/MM/dd HH:mm"
            label={trans('deliveryDate')}
            renderInput={(params) => (
              <BaseTextField
                {...params}
                fullWidth
                helperText={formRepresentation.deliveryDate.error}
                error={!!formRepresentation.deliveryDate.error}
                inputProps={{
                  ...params.inputProps,
                  placeholder: trans('selectDeliveryDate'),
                }}
              />
            )}
          />
          <Box sx={{ m: '.25rem' }} />
          <Select
            disabled={disabled}
            value={formRepresentation.deliveryType.value}
            error={!!formRepresentation.deliveryType.error}
            helperText={formRepresentation.deliveryType.error}
            onChange={(e) => setValue({ field: 'deliveryType', value: e.target.value })}
            options={[
              { title: trans('pickup'), value: 0 },
              { title: trans('delivery'), value: 1 },
              { title: trans('shipping'), value: 2 },
            ]}
            label={trans('deliveryType')}
            placeholder={trans('selectDeliveryType')}
          />
          <Box sx={{ m: '.25rem' }} />
          <TextField
            disabled={disabled}
            fullWidth
            size="medium"
            multiline
            rows={3}
            label={trans('instructions')}
            placeholder={trans('instructions')}
            type="text"
            onChange={(e) => setValue({ field: 'deliveryInstructions', value: e.target.value })}
            value={formRepresentation.deliveryInstructions.value || ''}
          />
        </Grid>
      </Grid>
    </>
  );
}
