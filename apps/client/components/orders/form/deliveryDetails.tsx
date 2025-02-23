import {
  Box, Grid, Typography, Button,
} from '@mui/material';
import { useState } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import BaseTextField from '../../input/textField';
import Select from '../../memoizedInput/select';
import TextField from '../../memoizedInput/textField';
import DateTimePicker from '../../input/dateTimePicker';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_LOGISTICS_PATH } from '../../../utils/axios';
import useSecurity from '../../../hooks/useSecurity';

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
  const [showDeliveryDateChangedMessage, setShowDeliveryDateChangedMessage] = useState(false);
  const { hasModule } = useSecurity();

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
          <DateTimePicker
            disabled={disabled}
            onChange={(value) => {
              setValue({ field: 'deliveryDate', value });
              setShowDeliveryDateChangedMessage(true);
            }}
            value={formRepresentation.deliveryDate.value || null}
            inputFormat="yyyy/MM/dd HH:mm"
            label={trans('deliveryDate')}
            renderInput={(params) => (
              <BaseTextField
                {...params}
                helperText={formRepresentation.orderDate.error}
                sx={{ flex: 1 }}
                error={!!formRepresentation.orderDate.error}
              />
            )}
          />
          {showDeliveryDateChangedMessage && <Typography color="error" sx={{ mt: '.5rem' }}>{trans('orderMightShouldChangeWarning')}</Typography>}
          <Box sx={{ m: '.25rem' }} />
          <DataSourcePicker
            fullWidth
            disabled={disabled}
            path={AUTOCOMPLETE_LOGISTICS_PATH}
            label={trans('logistic')}
            placeholder={trans('selectLogistic')}
            onChange={(value: { id: number }) => {
              setValue({ field: 'logisticId', value: value?.id });
            }}
            value={formRepresentation.logisticId.value}
            formatter={({ id, username, ...rest }: any) => ({
              id, label: username, username, ...rest,
            })}
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
          {hasModule('dhl_tracking')
          && (
          <Box sx={{ mt: '.25rem', display: 'flex' }}>
            <TextField
              disabled={disabled}
              label={trans('dhlTrackingCode')}
              placeholder={trans('dhlTrackingCode')}
              size="medium"
              type="text"
              onChange={(e) => setValue({ field: 'dhlTrackingCode', value: e.target.value })}
              value={formRepresentation.dhlTrackingCode.value || ''}
              InputProps={{
                endAdornment: formRepresentation.dhlTrackingCode.value
                && formRepresentation.dhlTrackingCode.value == formRepresentation.dhlTrackingCode.originalValue
                && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => window.open(
                    `https://www.dhl.com/global-en/home/tracking/tracking-parcel.html?submit=1&tracking-id=${formRepresentation.dhlTrackingCode.value}`,
                    'blank',
                  )}
                  sx={{ mr: '.5rem', px: '1rem' }}
                >
                  {trans('track')}
                </Button>
                ),
              }}
            />
          </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
}
