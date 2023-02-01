import {
  Box, List, ListItemText, ListItemButton,
} from '@mui/material';
import Link from 'next/link';
import Dashboard from '@mui/icons-material/DashboardOutlined';
import People from '@mui/icons-material/PeopleOutlined';
import { trans } from 'itranslator';
import { useRouter } from 'next/router';
import { DASHBOARD, CUSTOMERS, SUPPLIERS } from '../../../utils/routes';

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
            fontWeight: 600,
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
          {
            title: trans('customers'),
            path: CUSTOMERS.replace('/:id', ''),
            icon: <People sx={{ marginX: 1 }} />,
            active: router.pathname === CUSTOMERS.replace('/:id', ''),
          },
          {
            title: trans('suppliers'),
            path: SUPPLIERS.replace('/:id', ''),
            icon: <People sx={{ marginX: 1 }} />,
            active: router.pathname === SUPPLIERS.replace('/:id', ''),
          },
        ].map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}
