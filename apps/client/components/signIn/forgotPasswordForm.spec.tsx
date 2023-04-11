import { fireEvent, render, waitFor } from '@testing-library/react';
import ForgotPasswordForm from './forgotPasswordForm';

const mockUseSecurity = {
  state: { get user() { return null; }, get loading() { return false; } },
  forgotPassword: jest.fn(),
};

jest.mock('../../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

describe('forgotPasswordForm', () => {
  afterEach(() => {
    mockUseSecurity.forgotPassword.mockReset();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ForgotPasswordForm onFormSelected={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onFormSelected with correct value', () => {
    const onFormSelected = jest.fn();
    const { getByText } = render(<ForgotPasswordForm onFormSelected={onFormSelected} />);

    fireEvent.click(getByText('signIn'));
    expect(onFormSelected).toBeCalledWith({ form: 'signIn' });
  });

  it("doesn't submit if form is invalid", () => {
    const { container } = render(<ForgotPasswordForm onFormSelected={() => {}} />);

    fireEvent.submit(container.querySelector('form[name="forgotPassword"]'));
    expect(mockUseSecurity.forgotPassword).not.toBeCalled();
  });

  it('submits if form is valid', () => {
    const onFormSelected = jest.fn();
    const { container } = render(<ForgotPasswordForm onFormSelected={onFormSelected} />);
    const emailOrUsername = 'username';

    const emailOrUsernameInput = container.querySelector("input[name='emailOrUsername']");
    fireEvent.change(emailOrUsernameInput, { target: { value: emailOrUsername } });

    fireEvent.submit(container.querySelector('form[name="forgotPassword"]'));
    expect(mockUseSecurity.forgotPassword).toBeCalledWith({ emailOrUsername });
    waitFor(() => expect(onFormSelected).toHaveBeenCalledWith({ form: 'changePassword' }));
  });

  it('performs no action when loading', () => {
    const onFormSelected = jest.fn();
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReturnValue(true);

    const { container, getByText } = render(<ForgotPasswordForm onFormSelected={onFormSelected} />);
    const emailOrUsername = 'username';

    const emailOrUsernameInput = container.querySelector("input[name='emailOrUsername']");
    fireEvent.change(emailOrUsernameInput, { target: { value: emailOrUsername } });

    fireEvent.submit(container.querySelector('form[name="forgotPassword"]'));

    fireEvent.click(getByText('signIn'));

    const submitButton = container.querySelector("button[type='submit']");
    fireEvent.click(submitButton);

    expect(onFormSelected).not.toBeCalled();
    expect(mockUseSecurity.forgotPassword).not.toBeCalled();
  });
});
