import { useEffect, useState } from 'react';
import { trans } from 'itranslator';
import localeStore, { LOCALE_UPDATED } from '../store/locale';

const useTranslation = () => {
  const [locale, setLocale] = useState<string>(localeStore.locale);

  useEffect(() => {
    localeStore.on(LOCALE_UPDATED, setLocale);
    return () => {
      localeStore.removeListener(LOCALE_UPDATED, setLocale);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLocale]);

  const updateLocale = (newLocale: string) => {
    localeStore.emit(LOCALE_UPDATED, newLocale);
    setLocale(newLocale);
  };

  return {
    updateLocale,
    trans,
    locale,
  };
};

export default useTranslation;
