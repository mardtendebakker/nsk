import {
  Box, AppBar, Toolbar, List, Drawer, IconButton,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Menu from '@mui/icons-material/Menu';
import { useState } from 'react';
import AccountPopover from './accountPopover';
import LanguagePopover from './languagePopover';
import {
  DASHBOARD,
  ORDERS_PURCHASES,
  ORDERS_SALES,
  STOCKS_PRODUCTS,
  STOCKS_REPAIR_SERVICES,
  MY_TASKS,
  LOGISTICS_DELIVERY,
  LOGISTICS_PICKUP,
  CONTACTS_CUSTOMERS,
  CONTACTS_SUPPLIERS,
  BULK_EMAIL,
  ORDERS_REPAIRS,
  STOCKS_ARCHIVED,
} from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';
import useResponsive from '../../../hooks/useResponsive';
import NavSection from './navSection';
import MenuItemText from '../../../components/menuTextItem';

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
      <Box sx={{ ml: '2rem' }}>
        <MenuItemText active={active}>
          {title}
        </MenuItemText>
      </Box>
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const { trans } = useTranslation();
  const [open, setOpen] = useState(false);
  const isDesktop = useResponsive('up', 'md');

  const MENU_LIST = [
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
      subItems: [
        {
          title: trans('products'),
          path: STOCKS_PRODUCTS,
          active: router.pathname.includes(STOCKS_PRODUCTS),
        },
        {
          title: trans('repairServices'),
          path: STOCKS_REPAIR_SERVICES,
          active: router.pathname.includes(STOCKS_REPAIR_SERVICES),
        },
        {
          title: trans('archived'),
          path: STOCKS_ARCHIVED,
          active: router.pathname.includes(STOCKS_ARCHIVED),
        },
      ],
    },
    {
      title: trans('orders'),
      path: ORDERS_PURCHASES,
      active: router.pathname.includes(ORDERS_PURCHASES)
      || router.pathname.includes(ORDERS_SALES)
      || router.pathname.includes(ORDERS_REPAIRS),
      subItems: [
        {
          title: trans('purchaseOrders'),
          path: ORDERS_PURCHASES,
          active: router.pathname.includes(ORDERS_PURCHASES),
        },
        {
          title: trans('salesOrders'),
          path: ORDERS_SALES,
          active: router.pathname.includes(ORDERS_SALES),
        },
        {
          title: trans('repairOrders'),
          path: ORDERS_REPAIRS,
          active: router.pathname.includes(ORDERS_REPAIRS),
        },
      ],
    },
    {
      title: trans('contacts'),
      path: CONTACTS_CUSTOMERS,
      active: router.pathname.includes(CONTACTS_CUSTOMERS)
               || router.pathname.includes(CONTACTS_SUPPLIERS),
      subItems: [
        {
          title: trans('customers'),
          path: CONTACTS_CUSTOMERS,
          active: router.pathname.includes(CONTACTS_CUSTOMERS),
        },
        {
          title: trans('suppliers'),
          path: CONTACTS_SUPPLIERS,
          active: router.pathname.includes(CONTACTS_SUPPLIERS),
        },
      ],
    },
    {
      title: trans('bulkEmail'),
      path: BULK_EMAIL,
      active: router.pathname.includes(BULK_EMAIL),
    },
    {
      title: trans('logistics'),
      path: LOGISTICS_PICKUP,
      active: router.pathname.includes(LOGISTICS_PICKUP)
               || router.pathname.includes(LOGISTICS_DELIVERY),
      subItems: [
        {
          title: trans('pickups'),
          path: LOGISTICS_PICKUP,
          active: router.pathname.includes(LOGISTICS_PICKUP),
        },
        {
          title: trans('deliveries'),
          path: LOGISTICS_DELIVERY,
          active: router.pathname.includes(LOGISTICS_DELIVERY),
        },
      ],
    },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{ display: 'flex' }}
    >
      <Toolbar sx={{ height: 50 }}>
        {!isDesktop && (
          <>
            <IconButton onClick={() => setOpen(true)} data-testid="openMenuButton">
              <Menu />
            </IconButton>
            <Drawer
              open={open}
              onClose={() => setOpen(false)}
              PaperProps={{
                sx: {
                  width: '19rem',
                },
              }}
            >
              <NavSection menuDescription={MENU_LIST} />
            </Drawer>
          </>
        )}
        {isDesktop && (
          <>
            <Image src="/assets/logo.jpg" alt="logo" width={50} height={9} />
            <List sx={{ p: 1, display: 'flex' }}>
              {MENU_LIST.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </List>
          </>
        )}
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
            m: '.5rem', width: '1px', height: '1.5rem', background: theme.palette.divider,
          })}
          />
          <AccountPopover />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
