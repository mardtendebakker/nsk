import React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';

import EditModal from '.';
import { initFormState } from '../createModal';

const mockAxios = {
  call: jest.fn(() => Promise.resolve()),
  get performing() { return false; },
  get data() { return undefined; },
};

jest.mock('../../../../../hooks/useAxios', () => () => mockAxios);
jest.mock('../form', () => function TestC() {
  return <div />;
});

const mockForm = {
  formRepresentation: initFormState({
    id: 1,
    name: 'Laptop Sub-Type',
    product_type_id: 2,
    magento_category_id: '123',
    magento_attr_set_id: '456',
    pindex: 1,
    productType: {
      id: 2,
      name: 'Electronics',
    },
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
        name: 'Laptop Sub-Type',
        product_type_id: 2,
        magento_category_id: '123',
        magento_attr_set_id: '456',
        pindex: 1,
      },
    });
  });

  it('closes properly', () => {
    const { getByText } = render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);
    fireEvent.click(getByText('cancel'));
    expect(onCloseMock).toBeCalled();
  });

  it('calls API on mount to fetch data', () => {
    render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);
    expect(mockAxios.call).toHaveBeenCalledWith();
    expect(mockAxios.call).toHaveBeenCalledTimes(1);
  });

  it('handles API call failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.call.mockRejectedValueOnce(new Error('API Error'));

    render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('handles different id types', () => {
    render(<EditModal id="5" onClose={onCloseMock} onSubmit={onSubmitMock} />);
    expect(mockAxios.call).toHaveBeenCalledWith();
    expect(mockAxios.call).toHaveBeenCalledTimes(1);
  });

  it('disables form when performing', () => {
    jest.spyOn(mockAxios, 'performing', 'get').mockReturnValueOnce(true);
    const { getByText } = render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);

    const confirmButton = getByText('confirm');
    expect(confirmButton).toBeDisabled();
  });

  it('enables form when not performing', () => {
    jest.spyOn(mockAxios, 'performing', 'get').mockReturnValueOnce(false);
    const { getByText } = render(<EditModal id="1" onClose={onCloseMock} onSubmit={onSubmitMock} />);

    const confirmButton = getByText('confirm');
    expect(confirmButton).not.toBeDisabled();
  });
});
