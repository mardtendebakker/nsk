import { MenuItem, MenuList } from '@mui/material';
import { useRouter } from 'next/router';
import {
  ADMIN_SETTINGS_LOCATIONS,
  ADMIN_SETTINGS_PRODUCT_TYPES,
  ADMIN_SETTINGS_ATTRIBUTES,
  ADMIN_SETTINGS_TASKS,
} from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';

export default function Menu() {
  const router = useRouter();
  const { trans } = useTranslation();
  const ITEMS = [
    {
      active: router.pathname === ADMIN_SETTINGS_LOCATIONS,
      text: trans('locations'),
      onClick: () => router.push(ADMIN_SETTINGS_LOCATIONS),
    },
    {
      active: router.pathname === ADMIN_SETTINGS_PRODUCT_TYPES,
      text: trans('productTypes'),
      onClick: () => router.push(ADMIN_SETTINGS_PRODUCT_TYPES),
    },
    {
      active: router.pathname === ADMIN_SETTINGS_ATTRIBUTES,
      text: trans('attributes'),
      onClick: () => router.push(ADMIN_SETTINGS_ATTRIBUTES),
    },
    {
      active: router.pathname === ADMIN_SETTINGS_TASKS,
      text: trans('tasks'),
      onClick: () => router.push(ADMIN_SETTINGS_TASKS),
    },
  ];

  return (
    <MenuList>
      {ITEMS.map(({ text, active, onClick }) => (
        <MenuItem
          onClick={onClick}
          sx={(theme) => ({
            borderRadius: '.25rem',
            fontWeight: theme.typography.fontWeightMedium,
            background: active ? '#D6E0FA' : undefined,
            color: active ? theme.palette.primary.main : undefined,
            mb: '1rem',
            py: '1rem',
          })}
          key={text}
        >
          {text}
        </MenuItem>
      ))}
    </MenuList>
  );
}
