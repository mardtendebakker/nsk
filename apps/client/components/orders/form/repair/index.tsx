import {
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import BaseTextField from '../../../input/textField';
import BasicDetails from '../basicDetails';
import PricingDetails from '../pricingDetails';
import CustomerDetails from '../customerDetails';
import Select from '../../../memoizedInput/select';
import TextField from '../../../memoizedInput/textField';

function RepairForm({
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
      <BasicDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex' }}>
        <PricingDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        <CustomerDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
      </CardContent>
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent>
        <Typography
          sx={{ mb: '1rem' }}
          variant="h4"
        >
          {trans('delivery')}
        </Typography>
        <Grid
          container
          spacing={3}
          sx={{ flexDirection: 'column' }}
        >
          <Grid sx={{ display: 'flex', width: '50%', flexDirection: 'column' }} item>
            <DesktopDatePicker
              onChange={(value) => setValue({ field: 'deliveryDate', value })}
              value={formRepresentation.deliveryDate.value || null}
              inputFormat="yyyy/MM/dd"
              label={trans('deliveryDate')}
              renderInput={(params) => (
                <BaseTextField
                  sx={{ mb: '.5rem' }}
                  fullWidth
                  error={!!formRepresentation.deliveryDate.error}
                  helperText={formRepresentation.deliveryDate.error}
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: trans('selectDeliveryDate'),
                  }}
                />
              )}
            />
            <Select
              sx={{ mb: '.5rem' }}
              value={formRepresentation.deliveryType.value}
              onChange={(e) => setValue({ field: 'deliveryType', value: e.target.value })}
              options={[
                { title: trans('pickup'), value: 0 },
                { title: trans('delivery'), value: 1 },
                { title: trans('shipping'), value: 2 },
              ]}
              label={trans('deliveryType')}
              placeholder={trans('selectDeliveryType')}
            />
            <TextField
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
      </CardContent>
    </>
  );
}

export default RepairForm;
