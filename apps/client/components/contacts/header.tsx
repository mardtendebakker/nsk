import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import {
  CONTACTS_CUSTOMERS,
  CONTACTS_CUSTOMERS_NEW,
  CONTACTS_SUPPLIERS,
  CONTACTS_SUPPLIERS_NEW,
} from '../../utils/routes';
import useResponsive from '../../hooks/useResponsive';
import HeaderItem from '../list/headerItem';

export default function Header() {
  const router = useRouter();
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  const ITEMS = [
    {
      active: router.pathname === CONTACTS_CUSTOMERS,
      text: trans('customers'),
      href: CONTACTS_CUSTOMERS,
    },
    {
      active: router.pathname === CONTACTS_SUPPLIERS,
      text: trans('suppliers'),
      href: CONTACTS_SUPPLIERS,
    },
  ];

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('contacts')}</Typography>
        {isDesktop && ITEMS.map(({ text, active, href }) => (
          <HeaderItem text={text} active={active} href={href} key={text} />
        ))}
      </Box>
      <Button
        sx={{ mb: '.5rem' }}
        size="small"
        variant="contained"
        onClick={
        () => router.push(
          router.pathname === CONTACTS_SUPPLIERS ? CONTACTS_SUPPLIERS_NEW : CONTACTS_CUSTOMERS_NEW,
        )
        }
      >
        <Add />
        {trans('newContact')}
      </Button>
    </Box>

  );
}
