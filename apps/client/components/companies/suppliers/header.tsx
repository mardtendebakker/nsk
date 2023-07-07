import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../../hooks/useTranslation';
import {
  SUPPLIERS_CONTACTS, SUPPLIERS_CONTACTS_NEW, SUPPLIERS_EMAILS, SUPPLIERS_EMAILS_NEW,
} from '../../../utils/routes';

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();

  const ITEMS = [
    {
      active: router.pathname === SUPPLIERS_CONTACTS,
      text: trans('contact'),
      onClick: () => router.push(SUPPLIERS_CONTACTS),
    },
    {
      active: router.pathname === SUPPLIERS_EMAILS,
      text: trans('bulkEmail'),
      onClick: () => router.push(SUPPLIERS_EMAILS),
    },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mr: '.5rem' }}>{trans('suppliers')}</Typography>
        <Box sx={{ display: 'flex' }}>
          {ITEMS.map(({ text, active, onClick }) => (
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
              })}
            >
              {text}
            </Typography>
          ))}
        </Box>
      </Box>
      <Button size="small"
        variant="contained"
        onClick={
        () => router.push(
          router.pathname === SUPPLIERS_CONTACTS ? SUPPLIERS_CONTACTS_NEW : SUPPLIERS_EMAILS_NEW,
        )
        }
      >
        <Add />
        {trans(router.pathname === SUPPLIERS_CONTACTS ? 'newContact' : 'newEmail')}
      </Button>
    </Box>

  );
}
