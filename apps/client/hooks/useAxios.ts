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
export const PUT = 'put';

type Method = 'get' | 'post' | 'patch' | 'delete' | 'put';
type ResponseType = 'json' | 'blob';

const useAxios = (
  method: Method,
  path: string,
  {
    withProgressBar = false,
    showErrorMessage = true,
    showSuccessMessage = false,
    customSuccessMessage,
  }
  : {
    withProgressBar? : boolean,
    showErrorMessage? : boolean,
    showSuccessMessage? : boolean,
    customSuccessMessage?: string
  } = {},
) => {
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [performing, setPerforming] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const source = useRef(CancelToken.source());

  useEffect(() => source.current.cancel, []);

  async function call(explicitPath: string, params?: object, body?: object, responseType?: ResponseType)
    : AxiosPromise<AxiosResponse> {
    if (method === POST || method === PATCH || method === PUT) {
      return axios[method](explicitPath, body, {
        cancelToken: source.current.token,
        params,
        responseType,
      });
    }

    return axios[method](explicitPath, {
      cancelToken: source.current.token, params, data: body, responseType,
    });
  }

  function handleSuccess(handledResponse: AxiosResponse) {
    enqueueSnackbar(
      customSuccessMessage || trans(handledResponse.status.toString()),
      { variant: 'success' },
    );
  }

  function handleError(e: Error | AxiosError) {
    const status = (e instanceof AxiosError && e.response) ? e.response.status : 500;

    enqueueSnackbar(trans(status.toString()), { variant: 'error' });
  }

  return {
    data: response?.data,
    response,
    error,
    performing,
    /** @throws {Error} */
    call: async (
      {
        params, body, path: explicitPath, responseType,
      }
      : { params?: object, body?: object, path?: string, responseType?: ResponseType }
      = {},
      cb?: (e: Error, axiosResponse?: AxiosResponse) => void,
    ): Promise<AxiosResponse | void> => {
      try {
        const finalPath = explicitPath || path;

        setPerforming(true);
        if (withProgressBar) {
          showProgress();
        }

        const resp = await call(finalPath, params, body, responseType);
        setResponse(resp);

        if (showSuccessMessage || customSuccessMessage) {
          handleSuccess(resp);
        }

        if (cb) {
          cb(null, resp);
        }

        return resp;
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

      return undefined;
    },
  };
};

export default useAxios;
