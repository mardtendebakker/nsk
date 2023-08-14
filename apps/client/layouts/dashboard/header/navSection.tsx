import { Box, MenuList } from '@mui/material';
import Image from 'next/image';
import NavItem, { MenuItemDescription } from '../../../components/navItem';

export default function NavSection({ menuDescription }: { menuDescription: MenuItemDescription[] }) {
  return (
    <nav>
      <Box sx={{ px: '1.8rem', mt: '2rem' }}>
        <Image src="/assets/logo.jpg" alt="logo" width={100} height={19} />
      </Box>
      <MenuList disablePadding sx={{ p: '1rem' }}>
        {menuDescription.map((menuItemDescription) => (
          <NavItem
            key={menuItemDescription.path}
            menuItemDescription={menuItemDescription}
          />
        ))}
      </MenuList>
    </nav>
  );
}
