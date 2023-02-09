import { getUser } from '../../utils/storage';
import EventEmitter from '../../utils/eventEmitter';
import { State, User } from './types';

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_OUT = 'SIGN_OUT';

export const EVENTS = [
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_OUT,
];

function reducer({ event, payload }: { event: string, payload?: User }): State {
  return {
    SIGN_IN_REQUEST: {
      signIngIn: true,
      user: null,
    },
    SIGN_IN_SUCCESS: {
      signIngIn: false,
      user: payload,
    },
    SIGN_OUT: {
      user: null,
      signIngIn: false,
    },
  }[event];
}

class SecurityEmitter extends EventEmitter {
  state: State;

  constructor() {
    super();
    const user = getUser();
    this.state = {
      signIngIn: false,
      user: user ? { ...user } : null,
    };
  }

  emit(event: string, payload?: User) {
    const newState = reducer({ event, payload });
    if (newState) {
      this.state = newState;
    }

    return super.emit(event, payload);
  }
}

export default new SecurityEmitter();
