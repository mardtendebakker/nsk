import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box, Divider, Typography, MenuItem, Avatar, IconButton, Popover,
} from '@mui/material';
import { trans } from 'itranslator';
import { useRouter } from 'next/router';
import { SIGN_IN } from '../../../utils/routes';

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const router = useRouter();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    router.push(SIGN_IN);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar alt="photoURL" />
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
            ##Shayan##
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            ##Shayan@gmail.com##
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          {trans('logout')}
        </MenuItem>
      </Popover>
    </>
  );
}
