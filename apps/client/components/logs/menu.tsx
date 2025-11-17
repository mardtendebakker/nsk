import { MenuList } from '@mui/material';
import { useRouter } from 'next/router';
import {
  LOGS_EMAILS,
  LOGS_ACTIVITY,
  LOGS_AORDER,
  LOGS_PRODUCT,
} from '../../utils/routes';
import useTranslation from '../../hooks/useTranslation';
import NavItem from '../navItem';

export default function Menu() {
  const router = useRouter();
  const { trans } = useTranslation();

  const ITEMS = [
    {
      active: router.pathname === LOGS_EMAILS,
      title: trans('emails'),
      path: LOGS_EMAILS,
    },
    {
      active: router.pathname === LOGS_ACTIVITY,
      title: trans('activityLogs'),
      path: LOGS_ACTIVITY,
    },
    {
      active: router.pathname === LOGS_AORDER,
      title: trans('aorderLogs'),
      path: LOGS_AORDER,
    },
    {
      active: router.pathname === LOGS_PRODUCT,
      title: trans('productLogs'),
      path: LOGS_PRODUCT,
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
