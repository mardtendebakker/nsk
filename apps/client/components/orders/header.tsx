import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import { ORDERS_PURCHASES, ORDERS_SALES } from '../../utils/routes';

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();

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
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ mr: '.5rem' }}>{trans('orders')}</Typography>
        <Box sx={{ display: 'flex' }}>
          {ITEMS.map(({ text, active, onClick }) => (
            <Typography
              key={text}
              onClick={() => !active && onClick()}
              variant="h4"
              sx={(theme) => ({
                cursor: 'pointer',
                background: active ? '#D6E0FA' : undefined,
                color: active ? theme.palette.primary.main : undefined,
                p: '.5rem .75rem',
                mr: '.5rem',
              })}
            >
              {text}
            </Typography>
          ))}
        </Box>
      </Box>
      <Button variant="contained" onClick={() => {}}>
        <Add />
        {trans('newPurchaseOrder')}
      </Button>
    </Box>

  );
}
