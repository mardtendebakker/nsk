import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import {
  ADMIN_USERS, ADMIN_SETTINGS, ADMIN_SETTINGS_LOCATIONS, ADMIN_MODULES, ADMIN_LOGISTICS, ADMIN_THEME,
  ADMIN_LOGISTICS_VEHICLES,
} from '../../utils/routes';
import Create from './users/create';
import useResponsive from '../../hooks/useResponsive';
import HeaderItem from '../list/headerItem';

export default function Header() {
  const router = useRouter();

  const { trans } = useTranslation();
  const [showUserForm, setShowUserForm] = useState(false);
  const isDesktop = useResponsive('up', 'md');

  const ITEMS = [
    {
      active: router.pathname === ADMIN_USERS,
      text: trans('manageUsers'),
      href: ADMIN_USERS,
    },
    {
      active: router.pathname.includes(ADMIN_SETTINGS),
      text: trans('manageAppSettings'),
      href: ADMIN_SETTINGS_LOCATIONS,
    },
    {
      active: router.pathname.includes(ADMIN_MODULES),
      text: trans('manageModules'),
      href: ADMIN_MODULES,
    },
    {
      active: router.pathname.includes(ADMIN_LOGISTICS),
      text: trans('manageLogistics'),
      href: ADMIN_LOGISTICS_VEHICLES,
    },
    {
      active: router.pathname.includes(ADMIN_THEME),
      text: trans('manageTheme'),
      href: ADMIN_THEME,
    },
  ];

  return (
    <Box sx={isDesktop ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } : {
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    }}
    >
      <Create open={showUserForm} onClose={() => setShowUserForm(false)} />
      <Box sx={
        isDesktop ? { display: 'flex', alignItems: 'center', flexWrap: 'wrap' } : {
          display: 'flex', flexWrap: 'wrap', flexDirection: 'column',
        }
      }
      >
        <Typography variant="h4" sx={{ mr: '.5rem', mb: isDesktop ? '.5rem' : '1rem' }}>{trans('adminCenter')}</Typography>
        {ITEMS.map(({ text, active, href }) => (
          <HeaderItem text={text} active={active} href={href} key={text} />
        ))}
      </Box>
      {router.pathname === ADMIN_USERS && (
      <Button
        size="small"
        variant="contained"
        onClick={() => setShowUserForm(true)}
      >
        <Add />
        {trans('newUser')}
      </Button>
      )}
    </Box>
  );
}
