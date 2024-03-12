import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { trans } from 'itranslator';
import axios, {
  AxiosResponse, AxiosPromise, CancelToken, AxiosError, CanceledError,
} from '../utils/axios';
import { hideProgress, showProgress } from '../components/topLinearProgress';

export const GET = 'get';
export const POST = 'post';
export const PATCH = 'patch';
export const DELETE = 'delete';
export const PUT = 'put';

type Method = 'get' | 'post' | 'patch' | 'delete' | 'put';
type ResponseType = 'json' | 'blob';

const useAxios = <Data>(
  method: Method,
  path: string,
  {
    withProgressBar = false,
    showErrorMessage = true,
    showSuccessMessage = false,
    customSuccessMessage,
    defaultParams = {},
    customStatusesMessages,
  }
  : {
    withProgressBar? : boolean,
    showErrorMessage? : boolean,
    showSuccessMessage? : boolean,
    customSuccessMessage?: (response: AxiosResponse) => string
    defaultParams?: object,
    customStatusesMessages?: { [key: number]: string }
  } = {},
) : {
    data?: Data,
    response?: AxiosResponse,
    error?: AxiosError,
    performing: boolean,
    call: Call,
  } => {
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [performing, setPerforming] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const source = useRef(CancelToken.source());

  useEffect(() => source.current.cancel, []);

  async function call(
    explicitPath: string,
    params?: object,
    body?: object,
    responseType?: ResponseType,
    headers?: object,
  )
    : AxiosPromise<AxiosResponse> {
    if (method === POST || method === PATCH || method === PUT) {
      return axios[method](explicitPath, body, {
        cancelToken: source.current.token,
        params: { ...defaultParams, ...params },
        responseType,
        headers,
      });
    }

    return axios[method](explicitPath, {
      cancelToken: source.current.token, params: { ...defaultParams, ...params }, data: body, responseType,
    });
  }

  function handleSuccess(handledResponse: AxiosResponse) {
    enqueueSnackbar(
      customSuccessMessage ? customSuccessMessage(handledResponse) : trans(handledResponse.status.toString()),
      { variant: 'success' },
    );
  }

  function handleError(e: Error | AxiosError) {
    const errorResponse = (e instanceof AxiosError && e.response) ? e.response : { status: 500, data: { message: undefined } };
    const errorMessage = customStatusesMessages && customStatusesMessages[errorResponse.status];
    let messages: string[] = [];

    switch (true) {
      case typeof errorMessage == 'string':
        messages.push(errorMessage);
        break;
      case Array.isArray(errorResponse.data.message):
        messages = errorResponse.data.message;
        break;
      case typeof errorResponse.data.message == 'string' && !!errorResponse.data.message:
        messages.push(errorResponse.data.message);
        break;
      default:
        messages.push(trans(errorResponse.status.toString()));
    }

    messages.forEach((message) => {
      enqueueSnackbar(message, { variant: 'error' });
    });
  }

  return {
    data: response?.data,
    response,
    error,
    performing,
    /** @throws {Error} */
    call: async (
      {
        params, body, path: explicitPath, responseType, headers,
      }
      : { params?: object, body?: object, path?: string, responseType?: ResponseType, headers?: object }
      = {},
      cb?: (e: Error, axiosResponse?: AxiosResponse) => void,
    ): Promise<AxiosResponse | void> => {
      try {
        const finalPath = explicitPath || path;

        setPerforming(true);
        if (withProgressBar) {
          showProgress();
        }

        const resp = await call(finalPath, params, body, responseType, headers);
        setResponse(resp);

        if (showSuccessMessage || customSuccessMessage) {
          handleSuccess(resp);
        }

        if (cb) {
          cb(null, resp);
        }

        return resp;
      } catch (e) {
        if (e instanceof CanceledError) {
          throw new Error(explicitPath + path);
        }

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

export type Call = (
  arg0?: { params?: object, body?: object, path?: string, responseType?: ResponseType, headers?: object },
  cb?: (e: Error, axiosResponse?: AxiosResponse) => void,
) => Promise<AxiosResponse | void>;

export default useAxios;
