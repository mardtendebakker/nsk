import React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';

import EditModal from '.';
import { initFormState } from '../createModal';

const mockAxios = {
  call: jest.fn(() => Promise.resolve()),
  get performing() { return false; },
};

jest.mock('../../../../../hooks/useAxios', () => () => mockAxios);
jest.mock('../form', () => function TestC() {
  return <div />;
});

const mockForm = {
  formRepresentation: initFormState({
    id: 1,
    name: 'name',
    registration_number: 'regnum',
  }),
  setValue: jest.fn(() => {}),
  validate: jest.fn((): void | { [key: string]: string } => {}),
  setData: jest.fn(() => {}),
};

jest.mock('../../../../../hooks/useForm', () => () => mockForm);

describe('EditModal', () => {
  const onCloseMock = jest.fn();
  const onSubmitMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot', () => {
    const { asFragment } = render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('Prevents submit while performing', () => {
    jest.spyOn(mockAxios, 'performing', 'get').mockReturnValueOnce(true);
    const { getByText } = render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('confirm'));
    waitFor(() => expect(onSubmitMock).not.toBeCalled());
    expect(mockAxios.call).toHaveBeenCalledWith();
    expect(mockAxios.call).toHaveBeenCalledTimes(1);
  });
  it('Prevents submit with invalid payload', () => {
    jest.spyOn(mockForm, 'validate').mockReturnValueOnce({ error: 'error' });
    const { getByText } = render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('confirm'));
    waitFor(() => expect(onSubmitMock).not.toBeCalled());
    expect(mockAxios.call).toHaveBeenCalledWith();
    expect(mockAxios.call).toHaveBeenCalledTimes(1);
  });
  it('submits properly', () => {
    const { getByText } = render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('confirm'));
    waitFor(() => expect(onSubmitMock).toBeCalled());
    expect(mockAxios.call).toBeCalledWith({
      body: {
        name: 'name',
        registration_number: 'regnum',
      },
    });
  });
  it('closes properly', () => {
    const { getByText } = render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('cancel'));
    expect(onCloseMock).toBeCalled();
  });
});
