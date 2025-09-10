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
        name: null,
        product_type_id: null,
        magento_category_id: null,
        magento_attr_set_id: null,
        pindex: null,
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
        id: 1,
        name: 'Laptop Sub-Type',
        product_type_id: 2,
        magento_category_id: '123',
        magento_attr_set_id: '456',
        pindex: 1,
        productType: {
          id: 2,
          name: 'Electronics'
        }
      }),
    ).toEqual({
      name: { value: 'Laptop Sub-Type', required: true },
      product_type_id: { value: 2, required: true },
      magento_category_id: { value: '123' },
      magento_attr_set_id: { value: '456' },
      pindex: { value: 1 },
    });
  });

  it('inits state with minimal data', () => {
    expect(
      initFormState({
        id: 1,
        name: 'Minimal Sub-Type',
        product_type_id: 2,
      }),
    ).toEqual({
      name: { value: 'Minimal Sub-Type', required: true },
      product_type_id: { value: 2, required: true },
      magento_category_id: { value: undefined },
      magento_attr_set_id: { value: undefined },
      pindex: { value: undefined },
    });
  });

  it('build payload properly', () => {
    expect(formRepresentationToBody({
      name: { value: 'Laptop Sub-Type', required: true },
      product_type_id: { value: 2, required: true },
      magento_category_id: { value: '123' },
      magento_attr_set_id: { value: '456' },
      pindex: { value: 1 },
    })).toEqual({
      name: 'Laptop Sub-Type',
      product_type_id: 2,
      magento_category_id: '123',
      magento_attr_set_id: '456',
      pindex: 1,
    });
  });

  it('build payload with null values', () => {
    expect(formRepresentationToBody({
      name: { value: null, required: true },
      product_type_id: { value: null, required: true },
      magento_category_id: { value: null },
      magento_attr_set_id: { value: null },
      pindex: { value: null },
    })).toEqual({
      name: null,
      product_type_id: null,
      magento_category_id: null,
      magento_attr_set_id: null,
      pindex: null,
    });
  });

  it('build payload with undefined values', () => {
    expect(formRepresentationToBody({
      name: { value: undefined, required: true },
      product_type_id: { value: undefined, required: true },
      magento_category_id: { value: undefined },
      magento_attr_set_id: { value: undefined },
      pindex: { value: undefined },
    })).toEqual({
      name: null,
      product_type_id: null,
      magento_category_id: null,
      magento_attr_set_id: null,
      pindex: null,
    });
  });
});
