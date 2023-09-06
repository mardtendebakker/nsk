import {
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import BaseTextField from '../../input/textField';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_ORDER_STATUSES_PATH } from '../../../utils/axios';

export default function BasicDetails({
  formRepresentation,
  disabled,
  setValue,
  disableOrderStatus,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
  disableOrderStatus?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <CardContent>
      <Typography
        sx={{ mb: '1rem' }}
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
            value={formRepresentation.orderDate.value || null}
            inputFormat="yyyy/MM/dd"
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
          {!disableOrderStatus && (
          <DataSourcePicker
            sx={{ flex: 1 }}
            url={AUTOCOMPLETE_ORDER_STATUSES_PATH}
            disabled={disabled}
            fullWidth
            placeholder={trans('selectStatus')}
            label={trans('orderStatus')}
            onChange={(selected: { id: number }) => setValue({ field: 'orderStatus', value: selected?.id })}
            value={formRepresentation.orderStatus.value}
            error={!!formRepresentation.orderStatus.error}
            helperText={formRepresentation.orderStatus.error}
          />
          )}
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
  );
}

BasicDetails.defaultProps = { disableOrderStatus: false };
