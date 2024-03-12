import {
  Box, AppBar, Toolbar, List, Drawer, IconButton, Tooltip,
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
  // MY_TASKS,
  LOGISTICS_DELIVERY,
  LOGISTICS_PICKUP,
  CONTACTS,
  // BULK_EMAIL,
  ORDERS_REPAIRS,
  STOCKS_ARCHIVED,
  getRouteGroups,
  COMPANIES,
} from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';
import useResponsive from '../../../hooks/useResponsive';
import NavSection from './navSection';
import MenuItemText from '../../../components/menuTextItem';
import Can from '../../../components/can';
import useSecurity from '../../../hooks/useSecurity';
import { MenuItemDescription } from '../../../components/navItem';

function MenuItem(
  {
    item: {
      title, path, active, requiredModule,
    },
  }
  : { item: MenuItemDescription },
) {
  const { trans } = useTranslation();

  return (
    <Can requiredGroups={getRouteGroups(path)}>
      <Box sx={{ ml: '2rem' }}>
        {requiredModule ? (
          <Tooltip title={trans('inactiveModuleMessage', { vars: (new Map()).set('module', requiredModule) })}>
            <span>
              <MenuItemText active={active} color="grey">
                {title}
              </MenuItemText>
            </span>
          </Tooltip>
        ) : (
          <Link
            href={path}
            passHref
            style={{ textDecoration: 'none' }}
          >
            <MenuItemText active={active}>
              {title}
            </MenuItemText>
          </Link>
        )}
      </Box>
    </Can>
  );
}

export default function Header() {
  const router = useRouter();
  const { trans } = useTranslation();
  const [open, setOpen] = useState(false);
  const isDesktop = useResponsive('up', 'md');
  const { hasModule } = useSecurity();

  const MENU_LIST: MenuItemDescription[] = [
    {
      title: trans('dashboard'),
      path: DASHBOARD,
      active: router.pathname === DASHBOARD,
    },
    {
      title: trans('stock'),
      path: STOCKS_PRODUCTS,
      active: router.pathname.startsWith(STOCKS_PRODUCTS)
              || router.pathname.startsWith(STOCKS_REPAIR_SERVICES),
      subItems: [
        {
          title: trans('products'),
          path: STOCKS_PRODUCTS,
          active: router.pathname.startsWith(STOCKS_PRODUCTS),
        },
        {
          title: trans('repairServices'),
          path: STOCKS_REPAIR_SERVICES,
          active: router.pathname.startsWith(STOCKS_REPAIR_SERVICES),
        },
        {
          title: trans('archived'),
          path: STOCKS_ARCHIVED,
          active: router.pathname.startsWith(STOCKS_ARCHIVED),
        },
      ],
    },
    {
      title: trans('orders'),
      path: ORDERS_PURCHASES,
      active: router.pathname.startsWith(ORDERS_PURCHASES)
      || router.pathname.startsWith(ORDERS_SALES)
      || router.pathname.startsWith(ORDERS_REPAIRS),
      subItems: [
        {
          title: trans('purchaseOrders'),
          path: ORDERS_PURCHASES,
          active: router.pathname.startsWith(ORDERS_PURCHASES),
        },
        {
          title: trans('salesOrders'),
          path: ORDERS_SALES,
          active: router.pathname.startsWith(ORDERS_SALES),
        },
        {
          title: trans('repairOrders'),
          path: ORDERS_REPAIRS,
          active: router.pathname.startsWith(ORDERS_REPAIRS),
        },
      ],
    },
    {
      title: trans('contacts'),
      path: CONTACTS,
      active: router.pathname.startsWith(CONTACTS),
    },
    {
      title: trans('companies'),
      path: COMPANIES,
      active: router.pathname.startsWith(COMPANIES),
    },
    /* {
      title: trans('bulkEmail'),
      path: BULK_EMAIL,
      active: router.pathname.startsWith(BULK_EMAIL),
    }, */
    {
      title: trans('logistics'),
      path: LOGISTICS_PICKUP,
      active: router.pathname.startsWith(LOGISTICS_PICKUP)
               || router.pathname.startsWith(LOGISTICS_DELIVERY),
      subItems: [
        {
          title: trans('pickups'),
          path: LOGISTICS_PICKUP,
          active: router.pathname.startsWith(LOGISTICS_PICKUP),
        },
        {
          title: trans('deliveries'),
          path: LOGISTICS_DELIVERY,
          active: router.pathname.startsWith(LOGISTICS_DELIVERY),
        },
      ],
      requiredModule: hasModule('logistics') ? undefined : 'logistics',
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
                <MenuItem key={item.path} item={item} />
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
          {/* <MenuItem item={{
            title: trans('myTasks'),
            path: MY_TASKS,
            active: router.pathname === MY_TASKS,
          }}
          /> */}
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
