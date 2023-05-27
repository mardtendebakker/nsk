import {
  Box, AppBar, Toolbar, List, Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AccountPopover from './accountPopover';
import LanguagePopover from './languagePopover';
import {
  DASHBOARD,
  ORDERS_PURCHASES,
  ORDERS_SALES,
  SUPPLIERS,
  CUSTOMERS_CONTACTS,
  CUSTOMERS_EMAILS,
  STOCKS_PRODUCTS,
  STOCKS_REPAIR_SERVICES,
  MY_TASKS,
} from '../../../utils/routes';
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
              title: trans('stock'),
              path: STOCKS_PRODUCTS,
              active: router.pathname.includes(STOCKS_PRODUCTS)
              || router.pathname.includes(STOCKS_REPAIR_SERVICES),
            },
            {
              title: trans('orders'),
              path: ORDERS_PURCHASES,
              active: router.pathname.includes(ORDERS_PURCHASES) || router.pathname.includes(ORDERS_SALES),
            },
            {
              title: trans('customers'),
              path: CUSTOMERS_CONTACTS,
              active: router.pathname.includes(CUSTOMERS_CONTACTS)
               || router.pathname.includes(CUSTOMERS_EMAILS),
            },
            {
              title: trans('suppliers'),
              path: SUPPLIERS,
              active: router.pathname.includes(SUPPLIERS),
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
          <MenuItem item={{
            title: trans('myTasks'),
            path: MY_TASKS,
            active: router.pathname === MY_TASKS,
          }}
          />
          <Box sx={{ mr: '2rem' }} />
          <LanguagePopover />
          <Box sx={(theme) => ({
            m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
          })}
          />
          <AccountPopover />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
