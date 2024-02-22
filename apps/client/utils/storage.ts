import { Cart } from '../stores/cart/cart';
import { User } from '../stores/security/user';

export const setDefaultLocale = (locale: string) => typeof window !== 'undefined' && localStorage.setItem('defaultLocale', locale);
export const getDefaultLocale = (): string | null => typeof window !== 'undefined' && (localStorage.getItem('defaultLocale') || 'nl');
export const getUser = (): null | User => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

export const clear = () => localStorage.clear();
export const signIn = (user: User) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch {
    clear();
  }
};

export const getCart = (): Cart => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || { modules: [] };
  } catch {
    return { modules: [] };
  }
};

export const setCart = (cart: Cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};
