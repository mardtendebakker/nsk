import React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';

import List from '.';

const mockAxios = {
  call: jest.fn(() => Promise.resolve()),
  get performing() { return false; },
  get data() { return { data: [{ id: 1 }], count: 1 }; },
};

jest.mock('../../../hooks/useAxios', () => () => mockAxios);
jest.mock('../form', () => function TestC() {
  return <div />;
});

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  asPath: '',
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('List', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot', () => {
    const { asFragment } = render(<List />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('makes first api call on mount', async () => {
    await waitFor(() => render(<List />));
    expect(mockRouter.replace).toBeCalledWith('?rowsPerPage=10', undefined, { scroll: false });
    expect(mockAxios.call).toBeCalledWith({ params: { skip: 0, take: 10 } });
  });
  it('handles search change properly', async () => {
    const { getByPlaceholderText } = render(<List />);
    fireEvent.change(getByPlaceholderText('search'), { target: { value: 'searchText' } });

    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('?rowsPerPage=10', undefined, { scroll: false }));
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('?rowsPerPage=10&search=searchText', undefined, { scroll: false }));
    await waitFor(() => expect(mockAxios.call).toHaveBeenCalledWith({ params: { skip: 0, take: 10 } }));
    await waitFor(() => expect(mockAxios.call).toHaveBeenCalledWith({ params: { search: 'searchText', skip: 0, take: 10 } }));
  });
  it('doesn\'t search while performing', async () => {
    const { getByPlaceholderText } = render(<List />);
    jest.spyOn(mockAxios, 'performing', 'get').mockReturnValue(true);

    fireEvent.change(getByPlaceholderText('search'), { target: { value: 'searchText' } });

    await waitFor(() => expect(mockRouter.replace).not.toHaveBeenCalledWith('?rowsPerPage=10&search=searchText', undefined, { scroll: false }));
    await waitFor(() => expect(mockAxios.call).not.toHaveBeenCalledWith({ params: { search: 'searchText', skip: 0, take: 10 } }));
  });
  it('handles edit properly', async () => {
    const { getByTestId } = render(<List />);
    expect(getByTestId('edit-icon-button')).toHaveAttribute('href', '/companies/1');
  });
});
