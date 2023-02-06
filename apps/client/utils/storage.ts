export const setDefaultLocale = (locale: string) => typeof window !== 'undefined' && localStorage.setItem('defaultLocale', locale);
export const getDefaultLocale = (): string | undefined => typeof window !== 'undefined' && (localStorage.getItem('defaultLocale') || 'nl');
