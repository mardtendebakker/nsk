import {
  Box,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import BaseTextField from '../../input/textField';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import useResponsive from '../../../hooks/useResponsive';
import { OrderType } from '../../../utils/axios/models/types';
import { autocompleteOrderStatusesPathMapper } from '../../../utils/axios/helpers/typeMapper';
import DatePicker from '../../input/datePicker';

export default function BasicDetails({
  formRepresentation,
  type,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  type: OrderType,
  disabled:boolean,
  setValue: SetValue,
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

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
        spacing={1}
        sx={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column' }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
        >
          <TextField
            sx={{ flex: 1 }}
            label={trans('orderForm.orderNr.label')}
            placeholder={trans('orderForm.orderNr.placeholder')}
            name="orderNr"
            onChange={(e) => setValue({ field: 'orderNr', value: e.target.value })}
            value={formRepresentation.orderNr.value || ''}
            error={!!formRepresentation.orderNr.error}
            helperText={formRepresentation.orderNr.error}
          />
          <Box sx={{ m: '.25rem' }} />
          <DatePicker
            disabled={disabled}
            label={trans('orderDate')}
            onChange={(value) => setValue({ field: 'orderDate', value })}
            value={formRepresentation.orderDate.value || null}
            renderInput={(params) => (
              <BaseTextField
                {...params}
                helperText={formRepresentation.orderDate.error}
                sx={{ flex: 1 }}
                error={!!formRepresentation.orderDate.error}
              />
            )}
          />
          <Box sx={{ m: '.25rem' }} />
          <DataSourcePicker
            sx={{ flex: 1 }}
            path={autocompleteOrderStatusesPathMapper(type)}
            disabled={disabled}
            fullWidth
            placeholder={trans('selectStatus')}
            label={trans('orderStatus')}
            onChange={(selected: { id: number }) => setValue({ field: 'orderStatus', value: selected?.id })}
            value={formRepresentation.orderStatus.value}
            error={!!formRepresentation.orderStatus.error}
            helperText={formRepresentation.orderStatus.error}
          />
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
            minRows={5}
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
