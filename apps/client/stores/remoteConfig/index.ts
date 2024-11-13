import EventEmitter from '../../utils/eventEmitter';
import { Config } from './config';

export interface State {
  config?: Config,
  loading: boolean,
}

export const FETCH_CONFIG_REQUEST = 'GET_CONFIG_REQUEST';
export const FETCH_CONFIG_REQUEST_FAILED = 'FETCH_CONFIG_REQUEST_FAILED';
export const FETCH_CONFIG_REQUEST_SUCCEEDED = 'FETCH_CONFIG_REQUEST_SUCCEEDED';

export const EVENTS = [
  FETCH_CONFIG_REQUEST,
  FETCH_CONFIG_REQUEST_FAILED,
  FETCH_CONFIG_REQUEST_SUCCEEDED,
];

function reducer(
  currentState: State,
  { event, payload }: { event: string, payload?: Config },
): State {
  switch (event) {
    case FETCH_CONFIG_REQUEST_SUCCEEDED:
      return { config: payload, loading: false };
    case FETCH_CONFIG_REQUEST_FAILED:
      return { ...currentState, loading: false };
    case FETCH_CONFIG_REQUEST:
      return { ...currentState, loading: true };
    default:
      return currentState;
  }
}

class RemoteConfigEmitter extends EventEmitter {
  state: State;

  constructor() {
    super();
    this.state = {
      loading: false,
      config: null,
    };
  }

  emit(event: string, payload?: Config) {
    const newState = reducer(this.state, { event, payload });
    if (newState) {
      this.state = newState;
    }

    return super.emit(event, payload);
  }
}

export default new RemoteConfigEmitter();
