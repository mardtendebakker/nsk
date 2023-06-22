import { useEffect, useState } from 'react';
import { trans, setConfig } from 'itranslator';
import moment from 'moment';
import { getDefaultLocale, setDefaultLocale } from '../utils/storage';
import EventEmitter from '../utils/eventEmitter';
import nlSource from '../public/translations/nl';
import enSource from '../public/translations/en';
import deSource from '../public/translations/de';

export const LOCALE_UPDATED = 'LOCALE_UPDATED';

export const localeMapping = {
  nl: nlSource,
  en: enSource,
  de: deSource,
};

const momentLocaleMapping = {
  // eslint-disable-next-line global-require
  nl: require('moment/locale/nl'),
  // eslint-disable-next-line global-require
  en: require('moment/locale/en-gb'),
  // eslint-disable-next-line global-require
  de: require('moment/locale/de'),
};

class LocaleEmitter extends EventEmitter {
  #locale = getDefaultLocale() || 'nl';

  constructor() {
    super();
    moment.locale(this.#locale, momentLocaleMapping[this.#locale]);
  }

  get locale() { return this.#locale; }

  emit(event: string, payload: string) {
    if (LOCALE_UPDATED === event) {
      this.#locale = payload;

      setConfig({ source: localeMapping[payload] });
      moment.locale(payload, momentLocaleMapping[payload]);
      setDefaultLocale(payload);
    }

    return super.emit(event, payload);
  }
}

export const localeStore = new LocaleEmitter();

const useTranslation = () => {
  const [locale, setLocale] = useState<string>(localeStore.locale);

  useEffect(() => {
    localeStore.on(LOCALE_UPDATED, setLocale);
    return () => {
      localeStore.removeListener(LOCALE_UPDATED, setLocale);
    };
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
