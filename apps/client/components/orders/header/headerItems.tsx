import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../../hooks/useTranslation';
import {
  ORDERS_PURCHASES, ORDERS_REPAIRS, ORDERS_SALES,
} from '../../../utils/routes';
import useResponsive from '../../../hooks/useResponsive';
import HeaderItem from '../../list/headerItem';

export default function HeaderItems() {
  const router = useRouter();
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  const ITEMS = [
    {
      active: router.pathname === ORDERS_PURCHASES,
      text: trans('purchaseOrders'),
      href: ORDERS_PURCHASES,
    },
    {
      active: router.pathname === ORDERS_SALES,
      text: trans('salesOrders'),
      href: ORDERS_SALES,
    },
    {
      active: router.pathname === ORDERS_REPAIRS,
      text: trans('repairOrders'),
      href: ORDERS_REPAIRS,
    },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('orders')}</Typography>
      {isDesktop && ITEMS.map(({ text, active, href }) => (
        <HeaderItem text={text} active={active} href={href} key={text} />
      ))}
    </Box>
  );
}
