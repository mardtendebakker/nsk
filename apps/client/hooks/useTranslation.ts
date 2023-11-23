import { useEffect, useState } from 'react';
import { trans, setConfig } from 'itranslator';
import { setDefaultOptions } from 'date-fns';
import {
  nl, enUS, de, fr,
} from 'date-fns/locale';
import Config from 'itranslator/lib/type/config';
import { getDefaultLocale, setDefaultLocale } from '../utils/storage';
import EventEmitter from '../utils/eventEmitter';
import nlSource from '../public/translations/nl';
import enSource from '../public/translations/en';
import deSource from '../public/translations/de';
import frSource from '../public/translations/fr';

export const LOCALE_UPDATED = 'LOCALE_UPDATED';
export type Trans = (key: string, config?: Config | undefined) => string;

export const localeMapping = {
  nl: nlSource,
  en: enSource,
  de: deSource,
  fr: frSource,
};

export const dateFnsMapping = {
  nl,
  en: enUS,
  de,
  fr,
};

class LocaleEmitter extends EventEmitter {
  #locale = getDefaultLocale() || 'nl';

  constructor() {
    super();
    setDefaultOptions({ locale: dateFnsMapping[this.#locale] });
  }

  get locale() { return this.#locale; }

  emit(event: string, payload: string) {
    if (LOCALE_UPDATED === event) {
      this.#locale = payload;

      setConfig({ source: localeMapping[payload] });
      setDefaultOptions({ locale: dateFnsMapping[payload] });
      setDefaultLocale(payload);
    }

    return super.emit(event, payload);
  }
}

export const localeStore = new LocaleEmitter();

const useTranslation = (): { updateLocale: (locale: string)=> void, trans: Trans, locale: string } => {
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
