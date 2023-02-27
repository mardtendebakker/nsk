import {
  Box, AppBar, Toolbar, List, Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AccountPopover from './accountPopover';
import LanguagePopover from './languagePopover';
import { DASHBOARD, CUSTOMERS, SUPPLIERS } from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';

function MenuItem(
  {
    item: {
      title, path, active,
    },
  }
  : { item : { title: string, path: string, active: boolean } },
) {
  return (
    <Link
      href={path}
      passHref
      style={{ textDecoration: 'none' }}
    >
      <Typography
        sx={(theme) => ({ ml: '2rem', fontWeight: active ? theme.typography.fontWeightBold : undefined })}
        color="primary"
        variant="body1"
      >
        {title}
      </Typography>
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const { trans } = useTranslation();

  return (
    <AppBar
      position="fixed"
      sx={{ display: 'flex' }}
    >
      <Toolbar sx={{ height: 88 }}>
        <Image src="/assets/logo.jpg" alt="logo" width={100} height={18} />
        <List sx={{ p: 1, display: 'flex' }}>
          {[
            {
              title: trans('dashboard'),
              path: DASHBOARD,
              active: router.pathname === DASHBOARD,
            },
            {
              title: trans('customers'),
              path: CUSTOMERS.replace('/:id', ''),
              active: router.pathname === CUSTOMERS.replace('/:id', ''),
            },
            {
              title: trans('suppliers'),
              path: SUPPLIERS.replace('/:id', ''),
              active: router.pathname === SUPPLIERS.replace('/:id', ''),
            },
          ].map((item) => (
            <MenuItem key={item.title} item={item} />
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LanguagePopover />
          <Box sx={(theme) => ({
            m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.grey[30],
          })}
          />
          <AccountPopover />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
