import { User } from '../stores/security/types';

export const setDefaultLocale = (locale: string) => typeof window !== 'undefined' && localStorage.setItem('defaultLocale', locale);
export const getDefaultLocale = (): string | undefined => typeof window !== 'undefined' && (localStorage.getItem('defaultLocale') || 'nl');
export const getUser = (): undefined | User => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return undefined;
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
