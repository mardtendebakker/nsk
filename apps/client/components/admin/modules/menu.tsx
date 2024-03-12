import { MenuList } from '@mui/material';
import { useRouter } from 'next/router';
import {
  ADMIN_MODULES,
  ADMIN_MODULES_PAYMENTS,
  ADMIN_MODULES_CART,
} from '../../../utils/routes';
import useTranslation from '../../../hooks/useTranslation';
import NavItem from '../../navItem';
import useCart from '../../../hooks/useCart';

export default function Menu() {
  const router = useRouter();
  const { trans } = useTranslation();
  const { totalModulesCount } = useCart();

  const ITEMS = [
    {
      active: router.pathname === ADMIN_MODULES,
      title: trans('modules'),
      path: ADMIN_MODULES,
    },
    {
      active: router.pathname === ADMIN_MODULES_PAYMENTS,
      title: trans('payments'),
      path: ADMIN_MODULES_PAYMENTS,
    },
    {
      active: router.pathname === ADMIN_MODULES_CART,
      title: (
        <>
          {trans('cart')}
          {' '}
          <b>
            (
            {totalModulesCount()}
            )
          </b>
        </>
      ),
      path: ADMIN_MODULES_CART,
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
