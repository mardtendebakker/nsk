import { MenuItem, MenuList } from '@mui/material';
import { useRouter } from 'next/router';
import {
  ADMIN_SETTINGS_LOCATIONS,
  ADMIN_SETTINGS_PRODUCT_TYPES,
  ADMIN_SETTINGS_PRODUCT_ATTRIBUTES,
  ADMIN_SETTINGS_PRODUCT_TASKS,
  ADMIN_SETTINGS_PRODUCT_AVAILABILITY,
  ADMIN_SETTINGS_STATUS,
  ADMIN_SETTINGS_MAILING_LISTS,
  ADMIN_SETTINGS_CUSTOMER_TAGS,
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
      active: router.pathname === ADMIN_SETTINGS_PRODUCT_ATTRIBUTES,
      text: trans('productAttributes'),
      onClick: () => router.push(ADMIN_SETTINGS_PRODUCT_ATTRIBUTES),
    },
    {
      active: router.pathname === ADMIN_SETTINGS_PRODUCT_TASKS,
      text: trans('productTasks'),
      onClick: () => router.push(ADMIN_SETTINGS_PRODUCT_TASKS),
    },
    {
      active: router.pathname === ADMIN_SETTINGS_PRODUCT_AVAILABILITY,
      text: trans('productAvailability'),
      onClick: () => router.push(ADMIN_SETTINGS_PRODUCT_AVAILABILITY),
    },
    {
      active: router.pathname === ADMIN_SETTINGS_STATUS,
      text: trans('status'),
      onClick: () => router.push(ADMIN_SETTINGS_STATUS),
    },
    {
      active: router.pathname === ADMIN_SETTINGS_MAILING_LISTS,
      text: trans('mailingLists'),
      onClick: () => router.push(ADMIN_SETTINGS_MAILING_LISTS),
    },
    {
      active: router.pathname === ADMIN_SETTINGS_CUSTOMER_TAGS,
      text: trans('customerTags'),
      onClick: () => router.push(ADMIN_SETTINGS_CUSTOMER_TAGS),
    },
  ];

  return (
    <MenuList>
      {ITEMS.map(({ text, active, onClick }) => (
        <MenuItem
          onClick={onClick}
          sx={(theme) => ({
            borderRadius: '.25rem',
            fontWeight: 500,
            background: active ? '#D6E0FA' : undefined,
            color: active ? theme.palette.primary.main : undefined,
            mb: '1rem',
          })}
          key={text}
        >
          {text}
        </MenuItem>
      ))}
    </MenuList>
  );
}
