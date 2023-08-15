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

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  const ITEMS = [
    {
      active: router.pathname === CONTACTS_CUSTOMERS,
      text: trans('customers'),
      onClick: () => router.push(CONTACTS_CUSTOMERS),
    },
    {
      active: router.pathname === CONTACTS_SUPPLIERS,
      text: trans('suppliers'),
      onClick: () => router.push(CONTACTS_SUPPLIERS),
    },
  ];

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('contacts')}</Typography>
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
