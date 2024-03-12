import { getUser, clear, signIn } from '../../utils/storage';
import EventEmitter from '../../utils/eventEmitter';
import { hideProgress } from '../../components/topLinearProgress';
import { User } from './user';

export * from './user';
export * from './group';

export interface State {
  user?: User,
  loading: boolean,
}

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_OUT = 'SIGN_OUT';
export const CONFIRM_ACCOUNT_REQUEST = 'CONFIRM_ACCOUNT_REQUEST';
export const SEND_VERIFICATION_CODE_REQUEST = 'SEND_VERIFICATION_CODE_REQUEST';
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const ACTION_FAILED = 'ACTION_FAILED';
export const SIGN_IN_REQUEST_FAILED = 'SIGN_IN_REQUEST_FAILED';
export const CONFIRM_ACCOUNT_REQUEST_FAILED = 'CONFIRM_ACCOUNT_REQUEST_FAILED';
export const SEND_VERIFICATION_CODE_REQUEST_FAILED = 'SEND_VERIFICATION_CODE_REQUEST_FAILED';
export const SIGN_UP_REQUEST_FAILED = 'SIGN_UP_REQUEST_FAILED';
export const SIGN_IN_REQUEST_SUCCEEDED = 'SIGN_IN_REQUEST_SUCCEEDED';
export const CONFIRM_ACCOUNT_REQUEST_SUCCEEDED = 'CONFIRM_ACCOUNT_REQUEST_SUCCEEDED';
export const SEND_VERIFICATION_CODE_REQUEST_SUCCEEDED = 'SEND_VERIFICATION_CODE_REQUEST_SUCCEEDED';
export const SIGN_UP_REQUEST_SUCCEEDED = 'SIGN_UP_REQUEST_SUCCEEDED';
export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_REQUEST_SUCCEEDED = 'FORGOT_PASSWORD_REQUEST_SUCCEEDED';
export const FORGOT_PASSWORD_REQUEST_FAILED = 'FORGOT_PASSWORD_REQUEST_FAILED';
export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_REQUEST_SUCCEEDED = 'CHANGE_PASSWORD_REQUEST_SUCCEEDED';
export const CHANGE_PASSWORD_REQUEST_FAILED = 'CHANGE_PASSWORD_REQUEST_FAILED';

export const EVENTS = [
  SIGN_IN_REQUEST,
  CONFIRM_ACCOUNT_REQUEST,
  SEND_VERIFICATION_CODE_REQUEST,
  SIGN_UP_REQUEST,
  SIGN_OUT,
  SIGN_IN_REQUEST_FAILED,
  CONFIRM_ACCOUNT_REQUEST_FAILED,
  SEND_VERIFICATION_CODE_REQUEST_FAILED,
  SIGN_UP_REQUEST_FAILED,
  SIGN_IN_REQUEST_SUCCEEDED,
  CONFIRM_ACCOUNT_REQUEST_SUCCEEDED,
  SEND_VERIFICATION_CODE_REQUEST_SUCCEEDED,
  SIGN_UP_REQUEST_SUCCEEDED,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_REQUEST_SUCCEEDED,
  FORGOT_PASSWORD_REQUEST_FAILED,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_REQUEST_SUCCEEDED,
  CHANGE_PASSWORD_REQUEST_FAILED,
];

function reducer(
  currentState: State,
  { event, payload }: { event: string, payload?: User },
): State {
  switch (event) {
    case SEND_VERIFICATION_CODE_REQUEST_SUCCEEDED:
    case CONFIRM_ACCOUNT_REQUEST_FAILED:
    case SEND_VERIFICATION_CODE_REQUEST_FAILED:
    case FORGOT_PASSWORD_REQUEST_FAILED:
    case FORGOT_PASSWORD_REQUEST_SUCCEEDED:
    case CHANGE_PASSWORD_REQUEST_SUCCEEDED:
    case CHANGE_PASSWORD_REQUEST_FAILED:
      return { ...currentState, loading: false };
    case SIGN_IN_REQUEST:
    case CONFIRM_ACCOUNT_REQUEST:
    case SEND_VERIFICATION_CODE_REQUEST:
    case SIGN_UP_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case CHANGE_PASSWORD_REQUEST:
      return { ...currentState, loading: true };
    case SIGN_UP_REQUEST_SUCCEEDED:
    case SIGN_IN_REQUEST_SUCCEEDED:
      signIn(payload);
      return { loading: false, user: payload };
    case SIGN_IN_REQUEST_FAILED:
    case SIGN_UP_REQUEST_FAILED:
    case CONFIRM_ACCOUNT_REQUEST_SUCCEEDED:
    case SIGN_OUT:
      clear();
      hideProgress();
      return { user: null, loading: false };
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
      loading: false,
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
