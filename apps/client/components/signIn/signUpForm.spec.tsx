import { fireEvent, render, waitFor } from '@testing-library/react';
import SignUpForm from './signUpForm';

const mockUseSecurity = {
  state: { get user() { return null; }, get loading() { return false; } },
  signUp: jest.fn(),
};

jest.mock('../../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

function fillFormInput(container, { username, email, password }) {
  const usernameInput = container.querySelector("input[name='username']");
  fireEvent.change(usernameInput, { target: { value: username } });

  const emailInput = container.querySelector("input[name='email']");
  fireEvent.change(emailInput, { target: { value: email } });

  const passwordInput = container.querySelector("input[name='password']");
  fireEvent.change(passwordInput, { target: { value: password } });
}

const username = 'username';
const email = 'email@mail.com';
const password = 'Mijkfjg12@';

describe('signUpForm', () => {
  afterEach(() => {
    mockUseSecurity.signUp.mockReset();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<SignUpForm onFormSelect={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onFormSelect with correct value', () => {
    const onFormSelect = jest.fn();
    const { getByText } = render(<SignUpForm onFormSelect={onFormSelect} />);

    fireEvent.click(getByText('signIn'));
    expect(onFormSelect).toBeCalledWith({ form: 'signIn' });
  });

  it("doesn't submit if form is invalid", () => {
    const { container } = render(<SignUpForm onFormSelect={() => {}} />);

    fillFormInput(container, { username, email: 'email', password: 'password' });

    fireEvent.submit(container.querySelector('form[name="signUp"]'));
    expect(mockUseSecurity.signUp).not.toBeCalled();
  });

  it('submits if form is valid', () => {
    const onFormSelect = jest.fn();
    const { container } = render(<SignUpForm onFormSelect={onFormSelect} />);

    fillFormInput(container, { username, email, password });

    fireEvent.submit(container.querySelector('form[name="signUp"]'));
    expect(mockUseSecurity.signUp).toBeCalledWith({
      username, email, password,
    });
    waitFor(() => expect(onFormSelect).toHaveBeenCalledWith({ form: 'signIn' }));
  });

  it('performs no action when loading', () => {
    const onFormSelect = jest.fn();
    jest.spyOn(mockUseSecurity.state, 'loading', 'get').mockReturnValue(true);

    const { container, getByText } = render(<SignUpForm onFormSelect={onFormSelect} />);

    fillFormInput(container, { username, email, password });

    fireEvent.submit(container.querySelector('form[name="signUp"]'));

    fireEvent.click(getByText('signIn'));

    const submitButton = container.querySelector("button[type='submit']");
    fireEvent.click(submitButton);

    expect(onFormSelect).not.toBeCalled();
    expect(mockUseSecurity.signUp).not.toBeCalled();
  });
});
