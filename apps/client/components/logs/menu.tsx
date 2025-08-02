import { MenuList } from '@mui/material';
import { useRouter } from 'next/router';
import {
  LOGS_EMAILS,
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
  ];

  return (
    <MenuList>
      {ITEMS.map((menuItemDescription) => (
        <NavItem menuItemDescription={menuItemDescription} key={menuItemDescription.path} />
      ))}
    </MenuList>
  );
}
