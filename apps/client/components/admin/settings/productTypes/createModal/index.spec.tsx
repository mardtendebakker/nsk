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
        attributes: [], comment: null, is_attribute: null, is_public: null, magento_attr_set_id: null, magento_category_id: null, name: null, tasks: [],
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
        id: 7,
        name: 'name',
        pindex: 0,
        comment: 'comment',
        tasks: [],
        attributes: [],
        is_attribute: true,
        is_public: true,
        magento_attr_set_id: '1',
        magento_category_id: '2',
      }),
    ).toEqual({
      attributes: { value: [] }, comment: { value: 'comment' }, is_attribute: { value: true }, is_public: { value: true }, magento_attr_set_id: { value: '1' }, magento_category_id: { value: '2' }, name: { required: true, value: 'name' }, tasks: { value: [] },
    });
  });

  it('build payload properly', () => {
    expect(formRepresentationToBody({
      attributes: { value: [] }, comment: { value: 'comment' }, is_attribute: { value: true }, is_public: { value: true }, magento_attr_set_id: { value: '1' }, magento_category_id: { value: '2' }, name: { required: true, value: 'name' }, tasks: { value: [] },
    })).toEqual({
      attributes: [], comment: 'comment', is_attribute: true, is_public: true, magento_attr_set_id: '1', magento_category_id: '2', name: 'name', tasks: [],
    });
  });
});
