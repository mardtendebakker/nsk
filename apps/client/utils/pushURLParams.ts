import { NextRouter } from 'next/router';

export default ({ params, router }: { params: URLSearchParams, router: NextRouter }) => {
  const paramsString = params.toString();
  const newPath = paramsString ? `${router.pathname}?${params.toString()}` : router.pathname;

  if (newPath != router.asPath) {
    router.replace(newPath);
  }
};
