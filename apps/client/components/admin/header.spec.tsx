import React from 'react';
import { render } from '@testing-library/react';
import Header from './header';
import { ADMIN_USERS } from '../../utils/routes';

const mockRouter = {
  push: jest.fn(),
  get pathname() { return ADMIN_USERS; },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../../hooks/useTranslation', () => jest.fn(() => ({
  trans: (key: string) => key,
})));

describe('Header component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders properly', () => {
    const { getByText } = render(<Header />);

    expect(getByText('manageUsers')).toBeInTheDocument();
    expect(getByText('manageAppSettings')).toBeInTheDocument();
    expect(getByText('newUser')).toBeInTheDocument();
  });
  it('renders properly if page it\'s not admin users page ', () => {
    jest.spyOn(mockRouter, 'pathname', 'get').mockReturnValue('other');
    const { getByText, queryByText } = render(<Header />);

    expect(getByText('manageUsers')).toBeInTheDocument();
    expect(getByText('manageAppSettings')).toBeInTheDocument();
    expect(queryByText('newUser')).not.toBeInTheDocument();
  });
});
