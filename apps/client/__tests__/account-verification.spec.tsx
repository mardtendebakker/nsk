import { fireEvent, render } from '@testing-library/react';
import AccountVerification from '../pages/account-verification';
import { SIGN_IN } from '../utils/routes';

const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

const mockUseSecurity = {
  state: { get user() { return { emailVerified: false }; }, get loading() { return false; } },
  confirmAccount: jest.fn(),
  sendVerificationCode: jest.fn(),
  signOut: jest.fn(),
};

jest.mock('../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

describe('account-verification', () => {
  afterEach(() => {
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReset();
    jest.spyOn(mockUseSecurity.state, 'user', 'get').mockReset();
    mockUseSecurity.sendVerificationCode.mockReset();
    mockUseSecurity.confirmAccount.mockReset();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<AccountVerification />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should redirect to sign in page', () => {
    jest.spyOn(mockUseSecurity.state, 'user', 'get').mockReturnValue(null);
    const { queryByText } = render(<AccountVerification />);
    expect(mockRouter.push).toBeCalledWith(SIGN_IN);
    expect(queryByText('accountVerification')).toBeNull();
  });

  it('should redirect to home page', () => {
    jest.spyOn(mockUseSecurity.state, 'user', 'get').mockReturnValue({ emailVerified: true });
    const { queryByText } = render(<AccountVerification />);
    expect(mockRouter.push).toBeCalledWith(SIGN_IN);
    expect(queryByText('accountVerification')).toBeNull();
  });

  it('should not request account confirmation / invalid code', () => {
    const { container } = render(<AccountVerification />);

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(mockUseSecurity.confirmAccount).not.toBeCalled();
  });

  it('should not request account confirmation / loading', () => {
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReturnValue(true);
    const { container } = render(<AccountVerification />);

    const input = container.querySelector("input[name='code']");
    fireEvent.change(input, { target: { value: 'code1' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(mockUseSecurity.confirmAccount).not.toBeCalled();
  });

  it('should request account confirmation', () => {
    const { container, getByLabelText } = render(<AccountVerification />);

    const input = getByLabelText('code');
    fireEvent.change(input, { target: { value: 'code' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(mockUseSecurity.confirmAccount).toBeCalledWith({ code: 'code' });
  });

  it('should request to send verification code', () => {
    const { getByText } = render(<AccountVerification />);

    const button = getByText('sendCode');
    fireEvent.click(button);

    expect(mockUseSecurity.sendVerificationCode).toBeCalled();
  });

  it('should not request to send verification code / loading', () => {
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReturnValue(true);
    const { getByText } = render(<AccountVerification />);

    const button = getByText('sendCode');
    fireEvent.click(button);

    expect(mockUseSecurity.sendVerificationCode).not.toBeCalled();
  });

  it('should logout', () => {
    const { getByText } = render(<AccountVerification />);

    const button = getByText('logout');
    fireEvent.click(button);

    expect(mockUseSecurity.signOut).toBeCalled();
  });
});
