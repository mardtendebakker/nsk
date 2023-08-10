import { useState } from 'react';
import {
  Divider, Typography, MenuItem, Avatar, Popover, Stack, IconButton, Button,
} from '@mui/material';
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/router';
import { ADMIN_USERS, SETTINGS } from '../../../utils/routes';
import useSecurity from '../../../hooks/useSecurity';
import useTranslation from '../../../hooks/useTranslation';
import Can from '../../../components/can';

export default function AccountPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(null);
  const { trans } = useTranslation();
  const { signOut, state: { user } } = useSecurity();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <Avatar sx={{ mr: '0.6rem' }}>{user?.username?.charAt(0)?.toUpperCase()}</Avatar>
      <Typography variant="h5" sx={{ mr: '0.6rem' }}>{user?.username}</Typography>
      <IconButton onClick={handleOpen}>
        <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
      </IconButton>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Stack sx={{ p: 1 }}>
          <MenuItem onClick={() => router.push(SETTINGS)}>
            {trans('settings')}
          </MenuItem>
          <Can requiredGroups={['admin', 'super_admin']}>
            <MenuItem onClick={() => router.push(ADMIN_USERS)}>
              {trans('admin')}
            </MenuItem>
          </Can>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack sx={{ p: 1 }}>
          <Button
            size="small"
            onClick={signOut}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'start',
            }}
            color="error"
          >
            <PowerSettingsNew sx={{ fontSize: '1rem' }} />
            {trans('logout')}
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
