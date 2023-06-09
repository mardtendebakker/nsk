import {
  setDefaultLocale, getDefaultLocale, getUser, clear, signIn,
} from './storage';

describe('storage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('setDefaultLocale should set the defaultLocale in localStorage', () => {
    setDefaultLocale('en');
    expect(localStorage.getItem('defaultLocale')).toBe('en');
  });

  test('getDefaultLocale should return the defaultLocale from localStorage or "nl" if it is not set', () => {
    expect(getDefaultLocale()).toBe('nl');
    localStorage.setItem('defaultLocale', 'en');
    expect(getDefaultLocale()).toBe('en');
  });

  test('getUser should return undefined if user is not set in localStorage', () => {
    expect(getUser()).toBeNull();
  });

  test('getUser should return the user object from localStorage', () => {
    const user = { id: 1, name: 'John' };
    localStorage.setItem('user', JSON.stringify(user));
    expect(getUser()).toEqual(user);
  });

  test('getUser should return undefined if user is not a valid JSON string in localStorage', () => {
    localStorage.setItem('user', 'invalidJSON');
    expect(getUser()).toBeNull();
  });

  test('clear should remove all items from localStorage', () => {
    localStorage.setItem('testKey', 'testValue');
    clear();
    expect(localStorage.getItem('testKey')).toBeNull();
  });

  test('signIn should store the user object in localStorage', () => {
    const user = {
      username: 'username',
      email: 'email@mail.com',
      emailVerified: false,
    };
    signIn(user);
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(user));
  });

  it('should clear localStorage if JSON.stringify throws an error', () => {
    const user = {
      username: 'username',
      email: 'email@mail.com',
      emailVerified: false,
    };

    const clearSpy = jest.spyOn(Object.getPrototypeOf(window.localStorage), 'clear').mockImplementationOnce(() => {});

    const setItemSpy = jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem').mockImplementationOnce(() => {
      throw new Error();
    });

    signIn(user);

    expect(getUser()).toBeNull();
    expect(setItemSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    clearSpy.mockRestore();
  });
});
