import { renderHook, act } from '@testing-library/react';
import useTranslation, { LOCALE_UPDATED, localeStore } from './useTranslation';

jest.mock('../public/translations/nl', () => ({ home: 'Home' }));
jest.mock('../public/translations/en', () => ({ home: 'Home' }));
jest.mock('../public/translations/de', () => ({ home: 'Zuhause' }));

describe('useTranslation', () => {
  test('should return a function to update locale', () => {
    const { result } = renderHook(() => useTranslation());
    const { updateLocale } = result.current;
    expect(updateLocale).toBeInstanceOf(Function);
  });

  test('should update locale when calling updateLocale function', () => {
    const { result } = renderHook(() => useTranslation());
    let eventEmitted = false;

    localeStore.on(LOCALE_UPDATED, () => {
      eventEmitted = true;
    });
    act(() => {
      result.current.updateLocale('en');
    });
    expect(eventEmitted).toEqual(true);
    expect(result.current.locale).toEqual('en');
  });

  test('should return a function to translate strings', () => {
    const { result } = renderHook(() => useTranslation());
    const { trans } = result.current;
    expect(trans).toBeInstanceOf(Function);
  });

  test('should return translated string based on current locale', () => {
    const { result } = renderHook(() => useTranslation());
    const { trans, updateLocale } = result.current;

    expect(trans('home')).toEqual('Home');
    act(() => {
      updateLocale('de');
    });
    expect(trans('home')).toEqual('Zuhause');
  });
});
