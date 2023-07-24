import { render } from '@testing-library/react';
import useSecurity from '../../hooks/useSecurity';
import { SIGN_IN, ACCOUNT_VERIFICATION } from '../../utils/routes';
import DashboardLayout from './index';

jest.mock('./header', () => () => {});

const mockRouter = {
  push: jest.fn(),
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
    const { refreshUserInfo } = useSecurity();

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
    useSecurity.mockImplementation(() => ({
      state: { user: null },
      refreshUserInfo: jest.fn(() => Promise.resolve()),
    }));
    const { container } = render(<DashboardLayout><b id="children">Text</b></DashboardLayout>);
    const element = container.querySelector('#children');

    expect(element).toBeNull();
    expect(mockRouter.push).toBeCalledWith(SIGN_IN);
  });
});
