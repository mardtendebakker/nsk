import {
  Box, Stack, AppBar, Toolbar, IconButton,
} from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import AccountPopover from './accountPopover';
import LanguagePopover from './languagePopover';

export default function Header({ onOpenNav }: { onOpenNav: ()=>void }) {
  return (
    <AppBar sx={{ display: 'flex', bgcolor: 'transparent', boxShadow: 'none' }}>
      <Toolbar sx={{ height: { xs: 64, md: 92 } }}>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Menu />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <LanguagePopover />
          <AccountPopover />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
