import { Collapse, MenuItem, Tooltip } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MenuItemText from './menuTextItem';
import { ModuleName } from '../stores/security';
import useTranslation from '../hooks/useTranslation';

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
  const { trans } = useTranslation();

  const {
    path,
    active,
    title,
    subItems,
    requiredModule,
  } = menuItemDescription;

  const hasSubItems = Array.isArray(menuItemDescription.subItems) && menuItemDescription.subItems.length > 0;

  if (requiredModule) {
    return (
      <Tooltip title={trans('inactiveModuleMessage', { vars: (new Map()).set('module', requiredModule) })}>
        <span>
          <MenuItem
            disabled
            sx={{
              borderRadius: '.25rem',
              mb: '.2rem',
              minHeight: 'unset',
            }}
          >
            <MenuItemText color="grey">
              {title}
            </MenuItemText>
          </MenuItem>
        </span>
      </Tooltip>
    );
  }

  if (hasSubItems) {
    return <CollapsableItem menuItemDescription={menuItemDescription} />;
  }

  return (
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
  title: string | JSX.Element,
  path?: string,
  active: boolean,
  subItems?: SubMenuItemDescription[],
  requiredModule?: ModuleName,
}

export interface SubMenuItemDescription {
  title: string | JSX.Element,
  path: string,
  active: boolean,
}
