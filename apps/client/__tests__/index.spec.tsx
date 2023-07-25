import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from '../pages/index';

const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../layouts/dashboard', () => ({ children }:{ children:JSX.Element }) => children);
jest.mock('../components/dashboard/analytics', () => ({ children }:{ children:JSX.Element }) => children);

const mockUseSecurity = {
  signOut: jest.fn(() => Promise.resolve()),
  state: { get user() { return null; } },
};

jest.mock('../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

describe('Dashboard component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Dashboard />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows username', () => {
    jest.spyOn(mockUseSecurity.state, 'user', 'get').mockReturnValue({ username: 'username' });
    const { getByText } = render(<Dashboard />);
    expect(getByText(/username/i)).toBeDefined();
  });

  it('shows username', () => {
    const { queryByText } = render(<Dashboard />);
    expect(queryByText('username')).toBeNull();
  });
});
