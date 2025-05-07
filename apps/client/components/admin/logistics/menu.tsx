import { MenuList } from '@mui/material';
import { useRouter } from 'next/router';
import {
  ADMIN_LOGISTICS_VEHICLES,
  ADMIN_LOGISTICS_DRIVERS,
} from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';
import NavItem from '../../navItem';

export default function Menu() {
  const router = useRouter();
  const { trans } = useTranslation();

  const ITEMS = [
    {
      active: router.pathname === ADMIN_LOGISTICS_VEHICLES,
      title: trans('vehicles'),
      path: ADMIN_LOGISTICS_VEHICLES,
    },
    {
      active: router.pathname === ADMIN_LOGISTICS_DRIVERS,
      title: trans('drivers'),
      path: ADMIN_LOGISTICS_DRIVERS,
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
