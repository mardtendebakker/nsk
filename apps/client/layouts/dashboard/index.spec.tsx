import { render } from '@testing-library/react';
import {
  ACCOUNT_VERIFICATION, DASHBOARD, ADMIN_SETTINGS,
} from '../../utils/routes';
import DashboardLayout from './index';

jest.mock('./header', () => () => {});
jest.mock('../../utils/can', () => jest.fn(() => true));

const mockRouter = {
  push: jest.fn(),
  get pathname() {
    return ADMIN_SETTINGS;
  },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

const mockUseSecurity = {
  state: {
    user: { get emailVerified() { return true; } },
  },
  refreshUserInfo: jest.fn(() => Promise.resolve()),
};

jest.mock('../../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

describe('DashboardLayout', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<DashboardLayout><b id="children">Text</b></DashboardLayout>);
    expect(asFragment()).toMatchSnapshot();
  });
  it('should render successfully when email verified', () => {
    const { container } = render(<DashboardLayout><b id="children">Text</b></DashboardLayout>);
    const element = container.querySelector('#children');
    const { refreshUserInfo } = jest.requireMock('../../hooks/useSecurity')();

    expect(refreshUserInfo).toBeCalled();
    expect(element).toBeDefined();
  });
  it('should redirects to account verification when email not verified', () => {
    jest.spyOn(mockUseSecurity.state.user, 'emailVerified', 'get').mockReturnValue(false);

    const { container } = render(<DashboardLayout><b id="children">Text</b></DashboardLayout>);
    const element = container.querySelector('#children');

    expect(element).toBeNull();
    expect(mockRouter.push).toBeCalledWith(ACCOUNT_VERIFICATION);
  });
  it('should redirects to sign in when email not verified', () => {
    jest.requireMock('../../hooks/useSecurity').mockImplementation(() => ({
      state: { user: null },
      refreshUserInfo: jest.fn(() => Promise.resolve()),
    }));
    const { container } = render(<DashboardLayout><b id="children">Text</b></DashboardLayout>);
    const element = container.querySelector('#children');

    expect(element).toBeNull();
    expect(mockRouter.push).toBeCalledWith(ACCOUNT_VERIFICATION);
  });
  it('should redirects to dashboard', () => {
    jest.requireMock('../../hooks/useSecurity').mockImplementation(() => ({
      state: { user: { get emailVerified() { return true; } } },
      refreshUserInfo: jest.fn(() => Promise.resolve()),
    }));
    jest.requireMock('../../utils/can').mockImplementation(() => false);
    jest.spyOn(mockRouter, 'pathname', 'get').mockReturnValue(ADMIN_SETTINGS);

    const { container } = render(<DashboardLayout><b id="children">Text</b></DashboardLayout>);
    const element = container.querySelector('#children');

    expect(element).toBeNull();
    expect(mockRouter.push).toBeCalledWith(DASHBOARD);
  });
});
