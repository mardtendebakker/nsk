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
    const { asFragment } = render(<SignInForm onFormSelected={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onFormSelected with correct value', () => {
    const onFormSelected = jest.fn();
    const { getByText } = render(<SignInForm onFormSelected={onFormSelected} />);

    fireEvent.click(getByText('signUp'));
    expect(onFormSelected).toBeCalledWith({ form: 'signUp' });

    fireEvent.click(getByText('forgotPasswordQuestion'));
    expect(onFormSelected).toBeCalledWith({ form: 'forgotPassword' });
  });

  it("doesn't submit if form is invalid", () => {
    const { container } = render(<SignInForm onFormSelected={() => {}} />);

    fillFormInput(container, { emailOrUsername, password: 'password' });

    fireEvent.submit(container.querySelector('form[name="signIn"]'));
    expect(mockUseSecurity.signIn).not.toBeCalled();
  });

  it('submits if form is valid', () => {
    const { container } = render(<SignInForm onFormSelected={() => {}} />);

    fillFormInput(container, { emailOrUsername, password });

    fireEvent.submit(container.querySelector('form[name="signIn"]'));
    expect(mockUseSecurity.signIn).toBeCalledWith({ emailOrUsername, password });
  });

  it('performs no action when loading', () => {
    const onFormSelected = jest.fn();
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReturnValue(true);

    const { container, getByText } = render(<SignInForm onFormSelected={onFormSelected} />);

    fillFormInput(container, { emailOrUsername, password });

    fireEvent.submit(container.querySelector('form[name="signIn"]'));

    fireEvent.click(getByText('signUp'));
    fireEvent.click(getByText('forgotPasswordQuestion'));

    const submitButton = container.querySelector("button[type='submit']");
    fireEvent.click(submitButton);

    expect(onFormSelected).not.toBeCalled();
    expect(mockUseSecurity.signIn).not.toBeCalled();
  });
});
