import { getUser, clear, signIn } from '../../utils/storage';
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

function reducer(
  currentState: State,
  { event, payload }: { event: string, payload?: User },
): State {
  switch (event) {
    case SIGN_IN_REQUEST:
      return { signIngIn: true, user: null };
    case SIGN_IN_SUCCESS:
      signIn(payload);
      return { signIngIn: false, user: payload };
    case SIGN_OUT:
      clear();
      return { user: null, signIngIn: false };
    default:
      return currentState;
  }
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
    const newState = reducer(this.state, { event, payload });
    if (newState) {
      this.state = newState;
    }

    return super.emit(event, payload);
  }
}

export default new SecurityEmitter();
