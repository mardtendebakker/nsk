import React from 'react';
import {
  render, fireEvent,
} from '@testing-library/react';

import List from '.';

const mockAxios = {
  call: jest.fn(() => Promise.resolve()),
  get performing() { return false; },
  get data() { return undefined; },
};

jest.mock('../../../../../hooks/useAxios', () => () => mockAxios);
jest.mock('../form', () => function TestC() {
  return <div />;
});

const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../../../settings/refreshList', () => jest.fn());

describe('List', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot', () => {
    const { asFragment } = render(<List />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('makes first api call on mount', () => {
    const refreshList = jest.requireMock('../../../settings/refreshList');
    render(<List />);
    expect(refreshList).toHaveBeenCalledWith({
      call: mockAxios.call, page: 1, router: { push: mockRouter.push }, rowsPerPage: 10, search: undefined,
    });
    expect(refreshList).toHaveBeenCalledTimes(1);
  });
  it('handles search change properly', async () => {
    const refreshList = jest.requireMock('../../../settings/refreshList');
    const { getByPlaceholderText } = render(<List />);

    fireEvent.change(getByPlaceholderText('search'), { target: { value: 'searchText' } });
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));
    expect(refreshList).toHaveBeenCalledWith({
      call: mockAxios.call, page: 1, router: { push: mockRouter.push }, rowsPerPage: 10, search: undefined,
    });
    expect(refreshList).toHaveBeenCalledWith({
      call: mockAxios.call, page: 1, router: { push: mockRouter.push }, rowsPerPage: 10, search: 'searchText',
    });
    expect(refreshList).toHaveBeenCalledTimes(2);
  });
  it('doesn\'t show create modal if button clicked and ajax performing', async () => {
    jest.spyOn(mockAxios, 'performing', 'get').mockReturnValue(true);
    const { queryByText, getByText } = render(<List />);
    fireEvent.click(getByText('newDriver'));
    expect(queryByText('createDriver')).toBeNull();
  });
  it('shows create modal if button clicked', async () => {
    jest.spyOn(mockAxios, 'performing', 'get').mockReturnValue(false);
    const { getByText } = render(<List />);
    fireEvent.click(getByText('newDriver'));
    expect(getByText('createDriver')).not.toBeNull();
  });
  it('shows edit modal if button clicked', async () => {
    jest.spyOn(mockAxios, 'performing', 'get').mockReturnValue(false);
    jest.spyOn(mockAxios, 'data', 'get').mockReturnValue({ data: [{ id: 1 }], count: 1 });
    const { getByTestId, getByText } = render(<List />);
    fireEvent.click(getByTestId('edit-icon-button'));
    expect(getByText('editDriver')).not.toBeNull();
  });
});
