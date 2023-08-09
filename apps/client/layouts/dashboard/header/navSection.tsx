import {
  Box, MenuItem, MenuList,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import MenuItemText from './menuItemText';

export default function NavSection({ data = [] }: { data: { title: string, path: string, active: boolean }[] }) {
  return (
    <>
      <Box sx={{ px: '1.8rem', mt: '2rem' }}>
        <Image src="/assets/logo.jpg" alt="logo" width={100} height={19} />
      </Box>
      <MenuList disablePadding sx={{ p: '1rem' }}>
        {data.map(({ title, path, active }) => (
          <Link href={path} style={{ textDecoration: 'none' }} key={path} passHref>
            <MenuItem
              sx={(theme) => ({
                borderRadius: '.25rem',
                background: active ? '#D6E0FA' : undefined,
                color: active ? theme.palette.primary.main : undefined,
                mb: '.2rem',
                p: '.5rem .75rem',
              })}
            >
              <MenuItemText active={active}>
                {title}
              </MenuItemText>
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </>
  );
}
