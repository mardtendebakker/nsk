import {
  Box, List, ListItemText, ListItemButton,
} from '@mui/material';
import Link from 'next/link';
import Dashboard from '@mui/icons-material/Dashboard';
import { trans } from 'itranslator';
import { useRouter } from 'next/router';
import { DASHBOARD } from '../../../pages/routes';

function NavItem(
  {
    item: {
      title, path, icon, active,
    },
  }
  : { item : { title: string, path: string, icon: JSX.Element, active: boolean } },
) {
  return (
    <Link
      href={path}
      passHref
      style={{ textDecoration: 'none' }}
    >
      <ListItemButton
        disableGutters
        sx={{
          color: (theme) => theme.palette.text.secondary,
          borderRadius: (theme) => theme.shape.borderRadius,
          ...(active) && {
            bgcolor: 'action.selected',
            fontWeight: 'fontWeightBold',
          },
        }}
      >
        {icon}
        <ListItemText disableTypography primary={title} />
      </ListItemButton>
    </Link>
  );
}

export default function NavSection() {
  const router = useRouter();

  return (
    <Box>
      <List disablePadding sx={{ p: 1 }}>
        {[
          {
            title: trans('dashboard'),
            path: DASHBOARD,
            icon: <Dashboard sx={{ marginX: 1 }} />,
            active: router.pathname === DASHBOARD,
          },
        ].map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}
