import { fireEvent, render, waitFor } from '@testing-library/react';
import ChangePasswordForm from './changePasswordForm';

const mockUseSecurity = {
  state: { get user() { return null; }, get loading() { return false; } },
  changePassword: jest.fn(),
};

jest.mock('../../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

function fillFormInput(container, { emailOrUsername, newPassword, verificationCode }) {
  const emailOrUsernameInput = container.querySelector("input[name='emailOrUsername']");
  fireEvent.change(emailOrUsernameInput, { target: { value: emailOrUsername } });

  const newPasswordInput = container.querySelector("input[name='newPassword']");
  fireEvent.change(newPasswordInput, { target: { value: newPassword } });

  const verificationCodeInput = container.querySelector("input[name='verificationCode']");
  fireEvent.change(verificationCodeInput, { target: { value: verificationCode } });
}

const emailOrUsername = 'username';
const newPassword = 'Mijkfjg12@';
const verificationCode = 'code';

describe('changePasswordForm', () => {
  afterEach(() => {
    mockUseSecurity.changePassword.mockReset();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ChangePasswordForm onFormSelected={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onFormSelected with correct value', () => {
    const onFormSelected = jest.fn();
    const { getByText } = render(<ChangePasswordForm onFormSelected={onFormSelected} />);

    fireEvent.click(getByText('signIn'));
    expect(onFormSelected).toBeCalledWith({ form: 'signIn' });
  });

  it("doesn't submit if form is invalid", () => {
    const { container } = render(<ChangePasswordForm onFormSelected={() => {}} />);

    fillFormInput(container, { emailOrUsername, newPassword: 'password', verificationCode });

    fireEvent.submit(container.querySelector('form[name="changePassword"]'));
    expect(mockUseSecurity.changePassword).not.toBeCalled();
  });

  it('submits if form is valid', () => {
    const onFormSelected = jest.fn();
    const { container } = render(<ChangePasswordForm onFormSelected={onFormSelected} />);

    fillFormInput(container, { emailOrUsername, newPassword, verificationCode });

    fireEvent.submit(container.querySelector('form[name="changePassword"]'));
    expect(mockUseSecurity.changePassword).toBeCalledWith({
      emailOrUsername, newPassword, verificationCode,
    });
    waitFor(() => expect(onFormSelected).toHaveBeenCalledWith({ form: 'signIn' }));
  });

  it('performs no action when loading', () => {
    const onFormSelected = jest.fn();
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReturnValue(true);

    const { container, getByText } = render(<ChangePasswordForm onFormSelected={onFormSelected} />);
    fillFormInput(container, { emailOrUsername, newPassword, verificationCode });

    fireEvent.submit(container.querySelector('form[name="changePassword"]'));

    fireEvent.click(getByText('signIn'));

    const submitButton = container.querySelector("button[type='submit']");
    fireEvent.click(submitButton);

    expect(onFormSelected).not.toBeCalled();
    expect(mockUseSecurity.changePassword).not.toBeCalled();
  });
});
