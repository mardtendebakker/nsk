import { useEffect, useState } from 'react';
import cartStore, {
  ADD_MODULE_REQUEST,
  CLEAR_CART_REQUEST,
  Cart, EVENTS, Module, REMOVE_MODULE_REQUEST,
} from '../stores/cart';

const useCart = (): {
  state: Cart,
  removeModule:(module: Module)=> void,
  addModule:(module: Module)=> void,
  clearCart:()=> void,
  totalModulesCount: () => number
  totalAmount: () => number
} => {
  const [state, setState] = useState<Cart>(cartStore.cart);

  function cb() {
    setState(cartStore.cart);
  }

  useEffect(() => {
    EVENTS.forEach((event) => {
      cartStore.on(event, cb);
    });

    return () => {
      EVENTS.forEach((event) => {
        cartStore.removeListener(event, cb);
      });
    };
  }, []);

  return {
    state,
    removeModule: (module: Module) => {
      cartStore.emit(REMOVE_MODULE_REQUEST, module);
    },
    addModule: (module: Module) => {
      cartStore.emit(ADD_MODULE_REQUEST, module);
    },
    clearCart: () => {
      cartStore.emit(CLEAR_CART_REQUEST);
    },
    totalModulesCount: () => state.modules.length,
    totalAmount: () => {
      let total = 0;

      state.modules.forEach(({ price }) => {
        total += price;
      });

      return total;
    },
  };
};

export default useCart;
