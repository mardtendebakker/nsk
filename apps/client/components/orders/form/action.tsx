import {
  Box, Button, Popover, Stack, MenuItem, Tooltip,
  Chip,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useState } from 'react';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { format } from 'date-fns';
import BulkPrintOrder from '../../button/bulkPrintOrder';
import useTranslation from '../../../hooks/useTranslation';
import { OrderType } from '../../../utils/axios/models/types';
import useSecurity from '../../../hooks/useSecurity';
import { Order } from '../../../utils/axios/models/order';
import CreateExacteInvoice from '../../button/createExactInvoice';
import { price } from '../../../utils/formatter';

function OrderSummary({ order, trans }: { order: Order, trans: (value: string) => string }) {
  const formatProductTypes = (totalPerProductType) => {
    if (!totalPerProductType || typeof totalPerProductType !== 'object') {
      return 'N/A';
    }

    return Object.entries(totalPerProductType).map(([type, total] : [type: OrderType, total: number]) => (
      <Chip
        key={type}
        label={`${type}: ${price(total)}`}
        variant="outlined"
        size="small"
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    ));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Order Summary
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Order Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('orderForm.orderNr.label')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {order.order_nr}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('orderDate')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {format(new Date(order.order_date), 'yyyy/MM/dd')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('orderStatus')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {order.order_status?.name}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('priceInclVat')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {price(order.totalPrice)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('priceExclVat')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {price(order.totalPriceExtVat)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('vat')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {price(order.vatValue)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('discount')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {price(order.discount)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('transportCost')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {price(order.transport)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('gift')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {trans(order.is_gift ? 'yes' : 'no')}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Delivery Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('deliveryDate')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {order.delivery?.date ? format(new Date(order.delivery.date), 'yyyy/MM/dd') : trans('notSpecified')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {trans('deliveryType')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {order.delivery?.type || trans('notSpecified')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              {trans('instructions')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {order.delivery?.instructions || trans('notSpecified')}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" color="primary" gutterBottom>
        {trans('totalPerProductType')}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {formatProductTypes(order.totalPerProductType)}
      </Box>
    </Box>
  );
}

export default function Action({
  id,
  onPerformingAction,
  onImportFromBlancco,
  onSave,
  disabled,
  order,
  type,
}:{
  id?: string,
  onPerformingAction: (state: boolean) => void,
  onSave: (e: SyntheticEvent) => void,
  onImportFromBlancco?: (e: SyntheticEvent) => void,
  disabled: boolean,
  order: Order,
  type: OrderType
}) {
  const { trans } = useTranslation();
  const { hasModule } = useSecurity();
  const [showBlanccoActions, setShowBlanccoActions] = useState(null);

  const handleBlancco = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowBlanccoActions(event.currentTarget);
  };

  const handleClose = () => {
    setShowBlanccoActions(null);
  };

  const hasBlancco = hasModule('blancco');

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      { type == 'sales' && id && (
      <CreateExacteInvoice
        orderId={parseInt(id, 10)}
        content={<OrderSummary order={order} trans={trans} />}
        onPerforming={(state:boolean) => onPerformingAction(state)}
        sx={{ mr: '.5rem' }}
      />
      )}
      {id && <BulkPrintOrder ids={[id]} onPerforming={(state:boolean) => onPerformingAction(state)} type={type} disabled={disabled} sx={{ mr: '.5rem' }} />}
      {id && onImportFromBlancco && (
        <>
          <Tooltip title={!hasBlancco && trans('inactiveModuleMessage', { vars: (new Map()).set('module', 'blancco') })}>
            <span>
              <Button size="small" onClick={handleBlancco} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled || !hasBlancco}>
                {trans('blancco.name')}
                <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
              </Button>
            </span>
          </Tooltip>
          <Popover
            open={Boolean(showBlanccoActions)}
            anchorEl={showBlanccoActions}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                '& .MuiMenuItem-root': {
                  typography: 'body2',
                },
              },
            }}
          >
            <Stack>
              <MenuItem onClick={onImportFromBlancco} disabled={disabled}>
                {trans('blancco.import')}
              </MenuItem>
            </Stack>
          </Popover>
        </>
      )}
      <Button
        size="small"
        variant="contained"
        onClick={onSave}
        disabled={disabled}
      >
        <Check />
        {trans('save')}
      </Button>
    </Box>
  );
}
