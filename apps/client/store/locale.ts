import { setConfig } from 'itranslator';
import { getDefaultLocale, setDefaultLocale } from '../utils/storage';
import nlSource from '../public/translations/nl';
import enSource from '../public/translations/en';
import deSource from '../public/translations/de';
import EventEmitter from '../utils/eventEmitter';

export const LOCALE_UPDATED = 'LOCALE_UPDATED';

export const localeMapping = {
  nl: nlSource,
  en: enSource,
  de: deSource,
};

class LocaleEmitter extends EventEmitter {
  #locale = getDefaultLocale() || 'nl';

  get locale() { return this.#locale; }

  emit(event: string, payload: string) {
    this.#locale = payload;
    setConfig({ source: localeMapping[payload] });
    setDefaultLocale(payload);
    return super.emit(event, payload);
  }
}

export default new LocaleEmitter();
