import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import useResponsive from '../../hooks/useResponsive';
import { LOGISTICS_PICKUP, LOGISTICS_DELIVERY } from '../../utils/routes';
import HeaderItem from '../list/headerItem';

export default function Header() {
  const router = useRouter();
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  const ITEMS = [
    {
      active: router.pathname === LOGISTICS_PICKUP,
      text: trans('pickups'),
      href: LOGISTICS_PICKUP,
    },
    {
      active: router.pathname === LOGISTICS_DELIVERY,
      text: trans('deliveries'),
      href: LOGISTICS_DELIVERY,
    },
  ];

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('stock')}</Typography>
        {isDesktop && ITEMS.map(({ text, href, active }) => (
          <HeaderItem text={text} active={active} href={href} key={text} />
        ))}
      </Box>
    </Box>
  );
}
