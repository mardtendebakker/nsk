import React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';

import CreateModal, { initFormState, formRepresentationToBody } from '.';

const mockAxios = {
  call: jest.fn(() => Promise.resolve()),
  get performing() { return false; },
};

jest.mock('../../../../../hooks/useAxios', () => () => mockAxios);
jest.mock('../form', () => function TestC() {
  return <div />;
});

const mockForm = {
  formRepresentation: initFormState(),
  setValue: jest.fn(() => {}),
  validate: jest.fn((): void | { [key: string]: string } => {}),
  setData: jest.fn(() => {}),
};

jest.mock('../../../../../hooks/useForm', () => () => mockForm);

describe('CreateModal', () => {
  const onCloseMock = jest.fn();
  const onSubmitMock = jest.fn();

  it('matches snapshot', () => {
    const { asFragment } = render(<CreateModal onClose={onCloseMock} onSubmit={onSubmitMock} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('Prevents submit while performing', () => {
    jest.spyOn(mockAxios, 'performing', 'get').mockReturnValueOnce(true);
    const { getByText } = render(<CreateModal onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('confirm'));
    waitFor(() => expect(onSubmitMock).not.toBeCalled());
    expect(mockAxios.call).not.toBeCalled();
  });
  it('Prevents submit with invalid payload', () => {
    jest.spyOn(mockForm, 'validate').mockReturnValueOnce({ error: 'error' });
    const { getByText } = render(<CreateModal onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('confirm'));
    waitFor(() => expect(onSubmitMock).not.toBeCalled());
    expect(mockAxios.call).not.toBeCalled();
  });
  it('submits properly', () => {
    const { getByText } = render(<CreateModal onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('confirm'));
    waitFor(() => expect(onSubmitMock).toBeCalled());
    expect(mockAxios.call).toBeCalledWith({
      body: {
        color: undefined, is_purchase: false, is_repair: false, is_sale: false, mailbody: undefined, name: undefined,
      },
    });
  });
  it('closes properly', () => {
    const { getByText } = render(<CreateModal onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('cancel'));
    expect(onCloseMock).toBeCalled();
  });
  it('inits state properly', () => {
    expect(
      initFormState({
        id: 1, color: '#000000', is_purchase: true, is_repair: true, is_sale: true, mailbody: 'body', name: 'name',
      }),
    ).toEqual({
      color: { value: '#000000' }, isPurchase: { value: true }, isRepair: { value: true }, isSale: { value: true }, mailBody: { value: 'body' }, name: { required: true, value: 'name' },
    });
  });

  it('build payload properly', () => {
    expect(formRepresentationToBody({
      color: { value: '#000000' }, isPurchase: { value: true }, isRepair: { value: true }, isSale: { value: true }, mailBody: { value: 'body' }, name: { required: true, value: 'name' },
    })).toEqual({
      color: '#000000', is_purchase: true, is_repair: true, is_sale: true, mailbody: 'body', name: 'name',
    });
  });
});
