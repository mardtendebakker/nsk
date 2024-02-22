import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Header from './header';
import { ADMIN_USERS } from '../../utils/routes';

const mockRouter = {
  push: jest.fn(),
  get pathname() { return ADMIN_USERS; },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

const mockUseSecurity = {
  hasModule: jest.fn(() => true),
};

jest.mock('../../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders properly', () => {
    const { getByText } = render(<Header />);

    expect(getByText('companies')).toBeInTheDocument();
    expect(getByText('newCompany')).toBeInTheDocument();
  });
  it('pushed to new company page properly', () => {
    const { getByText } = render(<Header />);
    fireEvent.click(getByText('newCompany'));
    expect(mockRouter.push).toHaveBeenCalledWith('/companies/new');
  });
  it('don\'t push to new company page if module not active', () => {
    mockUseSecurity.hasModule.mockReturnValue(false);

    const { getByText } = render(<Header />);
    fireEvent.click(getByText('newCompany'));
    expect(mockRouter.push).not.toBeCalled();
    expect(mockUseSecurity.hasModule).toBeCalledWith('customer_contact_action');
  });
});
