import React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';

import CreateModal, { initFormState, formRepresentationToBody } from '.';

const mockAxios = {
  call: jest.fn(() => Promise.resolve({})),
  get performing() { return false; },
};

jest.mock('../../../../../hooks/useTranslation', () => jest.fn(() => ({
  trans: (key: string) => key,
})));
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
        attr_code: undefined,
        is_public: false,
        name: undefined,
        options: [],
        price: 0,
        productTypes: [],
        type: 0,
      },
    });
  });
  it('closes properly', () => {
    const { getByText } = render(<CreateModal onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('cancel'));
    expect(onCloseMock).toBeCalled();
  });
  it('inits state properly', () => {
    expect(initFormState({
      id: 1,
      attr_code: 7,
      name: 'name',
      type: 1,
      is_public: true,
      productTypes: [{
        id: 2,
        name: 'name',
        pindex: 1,
        comment: 'comment',
        is_attribute: true,
        is_public: true,
        attributes: [],
        tasks: [],
      }],
      product_type_id: 3,
      price: 4,
      options: [],
    })).toEqual({
      code: {
        required: true,
        value: 7,
      },
      id: {
        value: 1,
      },
      isPublic: {
        value: true,
      },
      name: {
        required: true,
        value: 'name',
      },
      price: {
        value: 4,
      },
      productTypeId: {
        value: 3,
      },
      productTypes: {
        value: [
          2,
        ],
      },
      type: {
        value: 1,
      },
    });
  });

  it('build payload properly', () => {
    expect(formRepresentationToBody({
      code: {
        required: true,
        value: 7,
      },
      id: {
        value: 1,
      },
      isPublic: {
        value: true,
      },
      name: {
        required: true,
        value: 'name',
      },
      price: {
        value: 4,
      },
      productTypeId: {
        value: 3,
      },
      productTypes: {
        value: [
          2,
        ],
      },
      type: {
        value: 1,
      },
      'option:new_123': { value: { name: 'test', price: 5 } },
    })).toEqual({
      attr_code: 7,
      is_public: true,
      name: 'name',
      options: [{ id: undefined, name: 'test', price: 5 }],
      productTypes: [2],
      type: 1,
    });
    expect(formRepresentationToBody({
      code: {
        required: true,
        value: 7,
      },
      id: {
        value: 1,
      },
      isPublic: {
        value: true,
      },
      name: {
        required: true,
        value: 'name',
      },
      price: {
        value: 4,
      },
      productTypeId: {
        value: 3,
      },
      productTypes: {
        value: [
          2,
        ],
      },
      type: {
        value: 2,
      },
    })).toEqual({
      attr_code: 7,
      is_public: true,
      name: 'name',
      options: [],
      price: 4,
      productTypes: [2],
      type: 2,
    });
    expect(formRepresentationToBody({
      code: {
        required: true,
        value: 7,
      },
      id: {
        value: 1,
      },
      isPublic: {
        value: true,
      },
      name: {
        required: true,
        value: 'name',
      },
      price: {
        value: 4,
      },
      productTypeId: {
        value: 3,
      },
      productTypes: {
        value: [
          2,
        ],
      },
      type: {
        value: 3,
      },
    })).toEqual({
      attr_code: 7,
      is_public: true,
      name: 'name',
      options: [],
      productTypes: [2],
      product_type_id: 3,
      type: 3,
    });
  });
});
