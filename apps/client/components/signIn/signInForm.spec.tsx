import { fireEvent, render } from '@testing-library/react';
import SignInForm from './signInForm';

const mockUseSecurity = {
  state: { get user() { return null; }, get loading() { return false; } },
  signIn: jest.fn(),
};

jest.mock('../../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

function fillFormInput(container, { emailOrUsername, password }) {
  const emailOrUsernameInput = container.querySelector("input[name='emailOrUsername']");
  fireEvent.change(emailOrUsernameInput, { target: { value: emailOrUsername } });

  const passwordInput = container.querySelector("input[name='password']");
  fireEvent.change(passwordInput, { target: { value: password } });
}

const emailOrUsername = 'username';
const password = 'Mijkfjg12@';

describe('signInForm', () => {
  afterEach(() => {
    mockUseSecurity.signIn.mockReset();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<SignInForm onFormSelect={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onFormSelect with correct value', () => {
    const onFormSelect = jest.fn();
    const { getByText } = render(<SignInForm onFormSelect={onFormSelect} />);

    fireEvent.click(getByText('signUp'));
    expect(onFormSelect).toBeCalledWith({ form: 'signUp' });

    fireEvent.click(getByText('forgotPasswordQuestion'));
    expect(onFormSelect).toBeCalledWith({ form: 'forgotPassword' });
  });

  it("doesn't submit if form is invalid", () => {
    const { container } = render(<SignInForm onFormSelect={() => {}} />);

    fillFormInput(container, { emailOrUsername, password: 'password' });

    fireEvent.submit(container.querySelector('form[name="signIn"]'));
    expect(mockUseSecurity.signIn).not.toBeCalled();
  });

  it('submits if form is valid', () => {
    const { container } = render(<SignInForm onFormSelect={() => {}} />);

    fillFormInput(container, { emailOrUsername, password });

    fireEvent.submit(container.querySelector('form[name="signIn"]'));
    expect(mockUseSecurity.signIn).toBeCalledWith({ emailOrUsername, password });
  });

  it('performs no action when loading', () => {
    const onFormSelect = jest.fn();
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReturnValue(true);

    const { container, getByText } = render(<SignInForm onFormSelect={onFormSelect} />);

    fillFormInput(container, { emailOrUsername, password });

    fireEvent.submit(container.querySelector('form[name="signIn"]'));

    fireEvent.click(getByText('signUp'));
    fireEvent.click(getByText('forgotPasswordQuestion'));

    const submitButton = container.querySelector("button[type='submit']");
    fireEvent.click(submitButton);

    expect(onFormSelect).not.toBeCalled();
    expect(mockUseSecurity.signIn).not.toBeCalled();
  });
});
