import { fireEvent, render } from '@testing-library/react';
import SignIn from '../pages/sign-in';
import { DASHBOARD } from '../utils/routes';

const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

const mockUseSecurity = {
  state: { get user() { return null; } },
};

jest.mock('../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

describe('account-verification', () => {
  afterEach(() => {
    jest.spyOn(mockUseSecurity.state, 'user', 'get').mockReset();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<SignIn />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should redirect to home page', () => {
    jest.spyOn(mockUseSecurity.state, 'user', 'get').mockReturnValue({ emailVerified: true });
    const { queryByText } = render(<SignIn />);
    expect(mockRouter.push).toBeCalledWith(DASHBOARD);
    expect(queryByText('signIn')).toBeNull();
  });

  it('should switch forms', () => {
    const { container, getByText } = render(<SignIn />);
    expect(container.querySelector('form[name="signIn"]')).toBeDefined();

    fireEvent.click(getByText('signUp'));
    expect(container.querySelector('form[name="signUp"]')).toBeDefined();

    fireEvent.click(getByText('signIn'));
    expect(container.querySelector('form[name="signIn"]')).toBeDefined();

    fireEvent.click(getByText('forgotPasswordQuestion'));
    expect(container.querySelector('form[name="forgotPassword"]')).toBeDefined();
  });
});
