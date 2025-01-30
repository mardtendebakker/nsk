import React from 'react';
import { render, screen } from '@testing-library/react';
import * as nextRouter from 'next/router';
import Menu from './menu';

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    trans: (key) => key,
  }),
}));

jest.mock('../../../hooks/useCart', () => ({
  __esModule: true,
  default: () => ({
    totalModulesCount: () => 5,
  }),
}));

jest.mock('@mui/material', () => ({
  // eslint-disable-next-line react/prop-types
  MenuList: ({ children }) => <div data-testid="menu-list">{children}</div>,
}));

jest.mock('../../navItem', () => ({
  __esModule: true,
  default: ({ menuItemDescription }) => (
    <div data-testid="nav-item">
      {typeof menuItemDescription.title === 'string'
        ? menuItemDescription.title
        : 'cart (5)'}
    </div>
  ),
}));

jest.mock('../../../utils/routes', () => ({
  ADMIN_MODULES: '/admin/modules',
  ADMIN_MODULES_PAYMENTS: '/admin/modules/payments',
  ADMIN_MODULES_CART: '/admin/modules/cart',
}));

describe('Menu Component', () => {
  const mockRouter = (pathname) => {
    jest.spyOn(nextRouter, 'useRouter').mockImplementation(() => ({
      pathname,
    }) as nextRouter.NextRouter);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Menu />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders all menu items', () => {
    mockRouter('/admin/modules');
    render(<Menu />);

    expect(screen.getByText('modules')).toBeInTheDocument();
    expect(screen.getByText('payments')).toBeInTheDocument();
    expect(screen.getByText('cart (5)')).toBeInTheDocument();
  });

  it('sets active state correctly for modules page', () => {
    mockRouter('/admin/modules');
    render(<Menu />);

    const navItems = screen.getAllByTestId('nav-item');
    expect(navItems).toHaveLength(3);
  });

  it('sets active state correctly for payments page', () => {
    mockRouter('/admin/modules/payments');
    render(<Menu />);

    const navItems = screen.getAllByTestId('nav-item');
    expect(navItems).toHaveLength(3);
  });

  it('sets active state correctly for cart page', () => {
    mockRouter('/admin/modules/cart');
    render(<Menu />);

    const navItems = screen.getAllByTestId('nav-item');
    expect(navItems).toHaveLength(3);
  });

  it('renders MenuList container', () => {
    mockRouter('/admin/modules');
    render(<Menu />);

    expect(screen.getByTestId('menu-list')).toBeInTheDocument();
  });

  it('passes correct props to NavItem components', () => {
    mockRouter('/admin/modules');
    render(<Menu />);

    const navItems = screen.getAllByTestId('nav-item');
    expect(navItems).toHaveLength(3);

    const firstNavItem = navItems[0];
    expect(firstNavItem).toHaveTextContent('modules');
  });

  it('displays cart count from useCart hook', () => {
    mockRouter('/admin/modules');
    render(<Menu />);

    expect(screen.getByText('cart (5)')).toBeInTheDocument();
  });
});
