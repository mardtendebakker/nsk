import { MenuList } from '@mui/material';
import { useRouter } from 'next/router';
import {
  ADMIN_SETTINGS_LOCATIONS,
  ADMIN_SETTINGS_PRODUCT_TYPES,
  ADMIN_SETTINGS_PRODUCT_SUB_TYPES,
  ADMIN_SETTINGS_ATTRIBUTES,
  ADMIN_SETTINGS_TASKS,
  ADMIN_SETTINGS_PRODUCT_STATUSES,
  ADMIN_SETTINGS_ORDER_STATUSES,
} from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';
import NavItem from '../../navItem';

export default function Menu() {
  const router = useRouter();
  const { trans } = useTranslation();
  const ITEMS = [
    {
      active: router.pathname === ADMIN_SETTINGS_LOCATIONS,
      title: trans('locations'),
      path: ADMIN_SETTINGS_LOCATIONS,
    },
    {
      active: router.pathname === ADMIN_SETTINGS_PRODUCT_TYPES,
      title: trans('productTypes'),
      path: ADMIN_SETTINGS_PRODUCT_TYPES,
    },
    {
      active: router.pathname === ADMIN_SETTINGS_PRODUCT_SUB_TYPES,
      title: trans('productSubTypes'),
      path: ADMIN_SETTINGS_PRODUCT_SUB_TYPES,
    },
    {
      active: router.pathname === ADMIN_SETTINGS_ATTRIBUTES,
      title: trans('attributes'),
      path: ADMIN_SETTINGS_ATTRIBUTES,
    },
    {
      active: router.pathname === ADMIN_SETTINGS_TASKS,
      title: trans('tasks'),
      path: ADMIN_SETTINGS_TASKS,
    },
    {
      active: router.pathname === ADMIN_SETTINGS_PRODUCT_STATUSES,
      title: trans('productStatuses'),
      path: ADMIN_SETTINGS_PRODUCT_STATUSES,
    },
    {
      active: router.pathname === ADMIN_SETTINGS_ORDER_STATUSES,
      title: trans('orderStatuses'),
      path: ADMIN_SETTINGS_ORDER_STATUSES,
    },
  ];

  return (
    <MenuList>
      {ITEMS.map((menuItemDescription) => (
        <NavItem menuItemDescription={menuItemDescription} key={menuItemDescription.path} />
      ))}
    </MenuList>
  );
}
