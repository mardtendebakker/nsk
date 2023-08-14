import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import {
  STOCKS_PRODUCTS, STOCKS_REPAIR_SERVICES, ORDERS_PURCHASES_NEW,
} from '../../utils/routes';
import useResponsive from '../../hooks/useResponsive';

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  const ITEMS = [
    {
      active: router.pathname === STOCKS_PRODUCTS,
      text: trans('products'),
      onClick: () => router.push(STOCKS_PRODUCTS),
    },
    {
      active: router.pathname === STOCKS_REPAIR_SERVICES,
      text: trans('repairServices'),
      onClick: () => router.push(STOCKS_REPAIR_SERVICES),
    },
  ];

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('stock')}</Typography>
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
        onClick={() => router.push(ORDERS_PURCHASES_NEW)}
      >
        <Add />
        {trans('newPurchase')}
      </Button>
    </Box>
  );
}
