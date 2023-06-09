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
    const { asFragment } = render(<ForgotPasswordForm onFormSelect={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onFormSelect with correct value', () => {
    const onFormSelect = jest.fn();
    const { getByText } = render(<ForgotPasswordForm onFormSelect={onFormSelect} />);

    fireEvent.click(getByText('signIn'));
    expect(onFormSelect).toBeCalledWith({ form: 'signIn' });
  });

  it("doesn't submit if form is invalid", () => {
    const { container } = render(<ForgotPasswordForm onFormSelect={() => {}} />);

    fireEvent.submit(container.querySelector('form[name="forgotPassword"]'));
    expect(mockUseSecurity.forgotPassword).not.toBeCalled();
  });

  it('submits if form is valid', () => {
    const onFormSelect = jest.fn();
    const { container } = render(<ForgotPasswordForm onFormSelect={onFormSelect} />);
    const emailOrUsername = 'username';

    const emailOrUsernameInput = container.querySelector("input[name='emailOrUsername']");
    fireEvent.change(emailOrUsernameInput, { target: { value: emailOrUsername } });

    fireEvent.submit(container.querySelector('form[name="forgotPassword"]'));
    expect(mockUseSecurity.forgotPassword).toBeCalledWith({ emailOrUsername });
    waitFor(() => expect(onFormSelect).toHaveBeenCalledWith({ form: 'changePassword' }));
  });

  it('performs no action when loading', () => {
    const onFormSelect = jest.fn();
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReturnValue(true);

    const { container, getByText } = render(<ForgotPasswordForm onFormSelect={onFormSelect} />);
    const emailOrUsername = 'username';

    const emailOrUsernameInput = container.querySelector("input[name='emailOrUsername']");
    fireEvent.change(emailOrUsernameInput, { target: { value: emailOrUsername } });

    fireEvent.submit(container.querySelector('form[name="forgotPassword"]'));

    fireEvent.click(getByText('signIn'));

    const submitButton = container.querySelector("button[type='submit']");
    fireEvent.click(submitButton);

    expect(onFormSelect).not.toBeCalled();
    expect(mockUseSecurity.forgotPassword).not.toBeCalled();
  });
});
