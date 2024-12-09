import { Box, MenuList } from '@mui/material';
import NavItem, { MenuItemDescription } from '../../../components/navItem';
import Can from '../../../components/can';
import { getRouteGroups } from '../../../utils/routes';
import useTheme from '../../../hooks/useTheme';

export default function NavSection({ menuDescription }: { menuDescription: MenuItemDescription[] }) {
  const { state: { theme: { logo } } } = useTheme();

  return (
    <nav>
      <Box sx={{ px: '1.8rem', mt: '2rem' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo || '/assets/logo.jpg'} alt="logo" width={100} height={19} />
      </Box>
      <MenuList disablePadding sx={{ p: '1rem' }}>
        {menuDescription.map((menuItemDescription) => (
          <Can requiredGroups={getRouteGroups(menuItemDescription.path)} key={menuItemDescription.path}>
            <NavItem
              menuItemDescription={menuItemDescription}
            />
          </Can>
        ))}
      </MenuList>
    </nav>
  );
}
