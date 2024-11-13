import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { render, waitFor } from '@testing-library/react';
import refreshList from './refreshList';

const mockAxios = {
  call: jest.fn(() => Promise.resolve()),
};

jest.mock('../../../hooks/useAxios', () => () => mockAxios);
jest.mock('../../../utils/pushURLParams', () => jest.fn());

jest.mock('next/router', () => ({ useRouter: () => ({}) }));

function TestC({ page, rowsPerPage, search }: { page:number, rowsPerPage?: number, search?: string }) {
  const router = useRouter();

  useEffect(() => {
    refreshList({
      page,
      rowsPerPage,
      router,
      search,
      call: mockAxios.call,
    });
  }, []);

  return <div />;
}

describe('refreshList', () => {
  it('works with all params passed', async () => {
    render(<TestC page={2} rowsPerPage={20} search="search" />);
    expect(mockAxios.call).toBeCalledWith({ params: { search: 'search', skip: 20, take: 20 } });
    await waitFor(() => { expect(jest.requireMock('../../../utils/pushURLParams').mockImplementation()).toBeCalledTimes(1); });
  });
  it('works with default params', async () => {
    render(<TestC page={1} />);
    expect(mockAxios.call).toBeCalledWith({ params: { search: undefined, skip: 0, take: 10 } });
    await waitFor(() => { expect(jest.requireMock('../../../utils/pushURLParams').mockImplementation()).toBeCalledTimes(1); });
  });
});
