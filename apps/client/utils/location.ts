export function getQueryParam(param: string, defaultValue?: string): null | undefined | string {
  return Object.fromEntries(
    // eslint-disable-next-line no-restricted-globals
    new URLSearchParams(location.search) as unknown as [[string, string]],
  )[param] || defaultValue || undefined;
}
