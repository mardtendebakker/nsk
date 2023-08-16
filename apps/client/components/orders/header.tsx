import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import {
  ORDERS_PURCHASES, ORDERS_PURCHASES_NEW, ORDERS_REPAIRS, ORDERS_REPAIRS_NEW, ORDERS_SALES, ORDERS_SALES_NEW,
} from '../../utils/routes';
import useResponsive from '../../hooks/useResponsive';

const NEW_ORDER_PATH = {
  [ORDERS_PURCHASES]: ORDERS_PURCHASES_NEW,
  [ORDERS_SALES]: ORDERS_SALES_NEW,
  [ORDERS_REPAIRS]: ORDERS_REPAIRS_NEW,
};

const NEW_ORDER_LABEL = {
  [ORDERS_PURCHASES]: 'newPurchase',
  [ORDERS_SALES]: 'newSale',
  [ORDERS_REPAIRS]: 'newRepair',
};

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  const ITEMS = [
    {
      active: router.pathname === ORDERS_PURCHASES,
      text: trans('purchaseOrders'),
      onClick: () => router.push(ORDERS_PURCHASES),
    },
    {
      active: router.pathname === ORDERS_SALES,
      text: trans('salesOrders'),
      onClick: () => router.push(ORDERS_SALES),
    },
    {
      active: router.pathname === ORDERS_REPAIRS,
      text: trans('repairOrders'),
      onClick: () => router.push(ORDERS_REPAIRS),
    },
  ];

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('orders')}</Typography>
        {isDesktop && ITEMS.map(({ text, active, onClick }) => (
          <Typography
            key={text}
            onClick={() => !active && onClick()}
            variant="h5"
            sx={(theme) => ({
              cursor: 'pointer',
              background: active ? '#D6E0FA' : undefined,
              color: active ? theme.palette.primary.main : undefined,
              p: '.5rem .75rem',
              mr: '.5rem',
              mb: '.5rem',
            })}
          >
            {text}
          </Typography>
        ))}
      </Box>
      <Button
        sx={{ mb: '.5rem' }}
        size="small"
        variant="contained"
        onClick={() => router.push(NEW_ORDER_PATH[router.pathname] || ORDERS_PURCHASES_NEW)}
      >
        <Add />
        {trans(NEW_ORDER_LABEL[router.pathname] || ORDERS_PURCHASES)}
      </Button>
    </Box>

  );
}
