import { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box, Drawer, Typography, Avatar,
} from '@mui/material';
import useSecurity from '../../../hooks/useSecurity';
import useResponsive from '../../../hooks/useResponsive';
import NavSection from '../nav-section';

export default function Nav({ openNav, onCloseNav }: { openNav: boolean, onCloseNav:()=>void }) {
  const isDesktop = useResponsive('up', 'lg');
  const { state: { user } } = useSecurity();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = (
    <>
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }} />
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          padding: (theme) => theme.spacing(2, 2.5),
          borderRadius: (theme) => theme.shape.borderRadius,
          backgroundColor: (theme) => alpha(theme.palette.grey[40], 0.12),
        }}
        >
          <Avatar alt="photoURL" />

          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {user?.username}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
      <NavSection />
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: 280 },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: 280,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: 280 },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
