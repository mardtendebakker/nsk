import { Collapse, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MenuItemText from './menuTextItem';

function CollapsableItem({ menuItemDescription }: { menuItemDescription: MenuItemDescription }) {
  const { title, subItems } = menuItemDescription;
  const [open, setOpen] = useState(!!subItems?.find((subItem: SubMenuItemDescription) => subItem.active));

  return (
    <>
      <MenuItem
        onClick={() => setOpen((currentValue) => !currentValue)}
        sx={{
          minHeight: 'unset',
          borderRadius: '.25rem',
          mb: '.2rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <MenuItemText>
          {title}
        </MenuItemText>
        <ChevronRight sx={{ transform: `rotate(${open ? '-90deg' : '90deg'})` }} />
      </MenuItem>
      <Collapse in={open}>
        {subItems?.map((subItem: SubMenuItemDescription) => (
          <Link href={subItem.path} style={{ textDecoration: 'none' }} key={subItem.path} passHref>
            <MenuItem
              sx={(theme) => ({
                borderRadius: '.25rem',
                minHeight: 'unset',
                background: subItem.active ? theme.palette.primary.light : undefined,
                color: subItem.active ? theme.palette.primary.main : undefined,
                mb: '.2rem',
                ml: '.5rem',
              })}
            >
              <MenuItemText active={subItem.active}>
                {subItem.title}
              </MenuItemText>
            </MenuItem>
          </Link>
        ))}
      </Collapse>
    </>
  );
}

export default function NavItem({ menuItemDescription }: { menuItemDescription: MenuItemDescription }) {
  const {
    path,
    active,
    title,
    subItems,
  } = menuItemDescription;

  const hasSubItems = Array.isArray(menuItemDescription.subItems) && menuItemDescription.subItems.length > 0;

  return hasSubItems
    ? (<CollapsableItem menuItemDescription={menuItemDescription} />)
    : (
      <Link href={path} style={{ textDecoration: 'none' }} passHref>
        <MenuItem
          sx={(theme) => ({
            borderRadius: '.25rem',
            background: active && !subItems ? theme.palette.primary.light : undefined,
            color: active && !subItems ? theme.palette.primary.main : undefined,
            mb: '.2rem',
            minHeight: 'unset',
          })}
        >
          <MenuItemText active={active && !subItems}>
            {title}
          </MenuItemText>
        </MenuItem>
      </Link>
    );
}

export interface MenuItemDescription {
  title: string,
  path?: string,
  active: boolean,
  subItems?: SubMenuItemDescription[]
}

export interface SubMenuItemDescription {
  title: string,
  path: string,
  active: boolean,
}
