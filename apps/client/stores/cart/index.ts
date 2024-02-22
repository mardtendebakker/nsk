import EventEmitter from '../../utils/eventEmitter';
import { getCart, setCart } from '../../utils/storage';
import { Cart } from './cart';
import { Module } from './module';

export * from './cart';
export * from './module';

export const ADD_MODULE_REQUEST = 'INCREMENT_MODULE_QUANTITY_REQUEST';
export const CLEAR_CART_REQUEST = 'CLEAR_CART_REQUEST';
export const REMOVE_MODULE_REQUEST = 'REMOVE_MODULE_REQUEST';

export const EVENTS = [
  ADD_MODULE_REQUEST,
  CLEAR_CART_REQUEST,
  REMOVE_MODULE_REQUEST,
];

function reducer(
  currentState: Cart,
  { event, payload }: { event: string, payload?: Module },
): Cart {
  switch (event) {
    case CLEAR_CART_REQUEST:
      return { modules: [] };
    case REMOVE_MODULE_REQUEST:
      return { modules: currentState.modules.filter((element: Module) => element.name !== payload?.name) };
    case ADD_MODULE_REQUEST: {
      if (!payload) {
        return currentState;
      }

      const modules = structuredClone(currentState.modules);
      let found = false;

      // eslint-disable-next-line no-restricted-syntax
      for (const element of modules) {
        if (element.name == payload.name) {
          found = true;
        }
      }

      if (!found) {
        return {
          modules: [
            ...modules,
            { ...payload },
          ],
        };
      }

      return { modules };
    }
    default:
      return currentState;
  }
}

class CartEmitter extends EventEmitter {
  cart: Cart;

  constructor() {
    super();
    this.cart = getCart();
  }

  emit(event: string, payload?: Module) {
    const newState = reducer(this.cart, { event, payload });
    if (newState) {
      setCart(newState);
      this.cart = newState;
    }

    return super.emit(event, payload);
  }
}

export default new CartEmitter();
