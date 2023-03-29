import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import { STOCKS_PRODUCTS, STOCKS_REPAIR_SERVICES, STOCKS_PRODUCTS_NEW } from '../../utils/routes';

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();

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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ mr: '.5rem' }}>{trans('stock')}</Typography>
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
      <Button
        variant="contained"
        onClick={() => router.pathname === STOCKS_PRODUCTS && router.push(STOCKS_PRODUCTS_NEW)}
      >
        <Add />
        {trans('newPurchase')}
      </Button>
    </Box>
  );
}
