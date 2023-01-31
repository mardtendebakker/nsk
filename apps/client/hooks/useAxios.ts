import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { trans } from 'itranslator';
import axios, {
  AxiosResponse, AxiosPromise, CancelToken, AxiosError,
} from '../utils/axios';
import { hideProgress, showProgress } from '../components/topLinearProgress';

export const GET = 'get';
export const POST = 'post';
export const PATCH = 'patch';
export const DELETE = 'delete';

type Method = 'get' | 'post' | 'patch' | 'delete';

const useAxios = (
  method: Method,
  path: string,
  { withProgressBar = false, showErrorMessage = true, showSuccessMessage = false },
) => {
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [performing, setPerforming] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const source = useRef(CancelToken.source());

  useEffect(() => source.current.cancel, []);

  async function call(explicitPath: string, params: object, body: object, explicitMethod: Method)
    : AxiosPromise<AxiosResponse> {
    const headers = {};

    if (explicitMethod === POST || explicitMethod === PATCH) {
      return axios[explicitMethod](explicitPath, body, {
        cancelToken: source.current.token,
        params,
        headers,
      });
    }

    return axios[explicitMethod](explicitPath, { cancelToken: source.current.token, params });
  }

  function handleSuccess(handledResponse: AxiosResponse) {
    enqueueSnackbar(
      trans(handledResponse.status.toString()),
      { variant: 'success' },
    );
  }

  function handleError(e: Error | AxiosError) {
    const status = e instanceof AxiosError ? e.response.status : 500;

    enqueueSnackbar(trans(status.toString()), { variant: 'error' });
  }

  return {
    data: response?.data,
    response,
    error,
    performing,
    /** @throws {Error} */
    call: async (
      { params, body, path: explicitPath }
      : { params: object, body: object, path?: string }
      = { params: {}, body: {}, path: undefined },
      cb?: (e: Error, axiosResponse?: AxiosResponse) => void,
    ): Promise<AxiosResponse | boolean> => {
      try {
        const finalPath = explicitPath || path;

        setPerforming(true);
        if (withProgressBar) {
          showProgress();
        }

        const resp = await call(finalPath, params, body, method);
        setResponse(resp);

        if (showSuccessMessage) {
          handleSuccess(resp);
        }

        if (cb) {
          cb(null, response);
        }

        return response;
      } catch (e) {
        setError(e);
        if (showErrorMessage) {
          handleError(e);
        }

        if (cb) {
          cb(e);
        } else {
          throw e;
        }
      } finally {
        setPerforming(false);

        if (withProgressBar) {
          hideProgress();
        }
      }

      return false;
    },
  };
};

export default useAxios;
