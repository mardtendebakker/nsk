import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import { PURCHASE_ORDERS, SALES_ORDERS } from '../../utils/routes';

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();

  const ITEMS = [
    {
      active: router.pathname === PURCHASE_ORDERS,
      text: trans('purchaseOrders'),
      onClick: () => router.push(PURCHASE_ORDERS),
    },
    {
      active: router.pathname === SALES_ORDERS,
      text: trans('salesOrders'),
      onClick: () => router.push(SALES_ORDERS),
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {ITEMS.map(({ text, active, onClick }) => (
        <Typography
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
  );
}
