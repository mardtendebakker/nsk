import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../../hooks/useTranslation';
import {
  CUSTOMERS_CONTACTS, CUSTOMERS_CONTACTS_NEW, CUSTOMERS_EMAILS, CUSTOMERS_EMAILS_NEW,
} from '../../../utils/routes';

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();

  const ITEMS = [
    {
      active: router.pathname === CUSTOMERS_CONTACTS,
      text: trans('contact'),
      onClick: () => router.push(CUSTOMERS_CONTACTS),
    },
    {
      active: router.pathname === CUSTOMERS_EMAILS,
      text: trans('bulkEmail'),
      onClick: () => router.push(CUSTOMERS_EMAILS),
    },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ mr: '.5rem' }}>{trans('customers')}</Typography>
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
        onClick={
        () => router.push(
          router.pathname === CUSTOMERS_CONTACTS ? CUSTOMERS_CONTACTS_NEW : CUSTOMERS_EMAILS_NEW,
        )
        }
      >
        <Add />
        {trans(router.pathname === CUSTOMERS_CONTACTS ? 'newContact' : 'newEmail')}
      </Button>
    </Box>

  );
}
