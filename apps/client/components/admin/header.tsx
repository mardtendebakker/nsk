import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import { ADMIN_USERS, ADMIN_SETTINGS, ADMIN_SETTINGS_LOCATIONS } from '../../utils/routes';
import Create from './users/create';

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();
  const [showUserForm, setShowUserForm] = useState(false);

  const ITEMS = [
    {
      active: router.pathname === ADMIN_USERS,
      text: trans('manageUsers'),
      onClick: () => router.push(ADMIN_USERS),
    },
    {
      active: router.pathname.includes(ADMIN_SETTINGS),
      text: trans('manageAppSettings'),
      onClick: () => router.push(ADMIN_SETTINGS_LOCATIONS),
    },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Create open={showUserForm} onClose={() => setShowUserForm(false)} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ mr: '.5rem' }}>{trans('adminCenter')}</Typography>
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
      {router.pathname === ADMIN_USERS && (
      <Button
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
