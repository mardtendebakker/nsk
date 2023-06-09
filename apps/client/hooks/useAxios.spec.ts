import { renderHook, act } from '@testing-library/react';
import client from '../utils/axios/client';
import useAxios, { GET, POST } from './useAxios';

jest.mock('notistack');
jest.mock('axios');

describe('useAxios', () => {
  beforeAll(() => {
  //  axios.CancelToken.source.mockReturnValue({ cancel: () => {} });
  });

  it('should make a successful API GET call', async () => {
    const mockResponse = { data: 'mockData' };

    const axiosMock = jest.spyOn(client, 'get').mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useAxios(GET, '/mockPath'));

    await act(async () => {
      await result.current.call({ params: { a: 'a' } });
    });

    expect(axiosMock).toHaveBeenCalledWith('/mockPath', { cancelToken: 'token', params: { a: 'a' } });
    expect(result.current.response).toBe(mockResponse);
    expect(result.current.data).toBe(mockResponse.data);
    expect(result.current.performing).toBe(false);
  });

  it('should make a successful API POST call', async () => {
    const mockResponse = { data: 'mockData' };

    const axiosMock = jest.spyOn(client, 'post').mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useAxios(POST, '/mockPath'));

    await act(async () => {
      await result.current.call({ params: { a: 'a' }, body: { b: 'b' } });
    });

    expect(axiosMock).toHaveBeenCalledWith('/mockPath', { b: 'b' }, { cancelToken: 'token', params: { a: 'a' } });
    expect(result.current.response).toBe(mockResponse);
    expect(result.current.data).toBe(mockResponse.data);
    expect(result.current.performing).toBe(false);
  });
});
