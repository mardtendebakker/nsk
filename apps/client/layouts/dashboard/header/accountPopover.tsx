import { useState } from 'react';
import {
  Box, Divider, Typography, MenuItem, Avatar, Popover, Stack, IconButton,
} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/router';
import { SETTINGS } from '../../../utils/routes';
import useSecurity from '../../../hooks/useSecurity';
import useTranslation from '../../../hooks/useTranslation';

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
      <Typography variant="h6" sx={{ mr: '0.6rem' }}>{user?.username}</Typography>
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
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Stack sx={{ p: 1 }}>
          <MenuItem onClick={() => router.push(SETTINGS)}>
            {trans('settings')}
          </MenuItem>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={signOut} sx={{ m: 1 }}>
          {trans('logout')}
        </MenuItem>
      </Popover>
    </>
  );
}
