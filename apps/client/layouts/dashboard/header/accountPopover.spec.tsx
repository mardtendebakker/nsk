import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AccountPopover from './accountPopover';

const mockUseSecurity = {
  signOut: jest.fn(() => Promise.resolve()),
  state: { user: null },
};

jest.mock('../../../utils/can', () => jest.fn(() => true));
jest.mock('../../../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('AccountPopover', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<AccountPopover />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should open the popover when the button is clicked', () => {
    const { getByRole, getByText } = render(<AccountPopover />);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(getByText(/settings/i)).toBeInTheDocument();
  });

  it('should not display menu by default', () => {
    const { queryByText } = render(<AccountPopover />);
    queryByText('logout');
    expect(queryByText('logout')).toBeNull();
  });

  it('should logout', () => {
    const { getByRole, getByText } = render(<AccountPopover />);
    const button = getByRole('button');
    fireEvent.click(button);
    const logoutButton = getByText('logout');
    fireEvent.click(logoutButton);
    expect(mockUseSecurity.signOut).toBeCalled();
  });
});
