import React from 'react';
import { render } from '@testing-library/react';
import Header from './header';
import { ADMIN_USERS } from '../../utils/routes';

const mockRouter = {
  get pathname() { return ADMIN_USERS; },
};

jest.mock('../../hooks/useResponsive', () => jest.fn(() => true));

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders properly for desktop', () => {
    const { queryByText } = render(<Header />);

    expect(queryByText('pickups')).toBeInTheDocument();
    expect(queryByText('deliveries')).toBeInTheDocument();
  });
  it('renders properly for not desktop', () => {
    jest.requireMock('../../hooks/useResponsive');
    jest.requireMock('../../hooks/useResponsive').mockImplementationOnce(() => false);
    const { queryByText } = render(<Header />);

    expect(queryByText('pickups')).not.toBeInTheDocument();
    expect(queryByText('deliveries')).not.toBeInTheDocument();
  });
});
