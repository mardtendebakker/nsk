import { NextRouter } from 'next/router';

export default ({ params, router }: { params: URLSearchParams, router: NextRouter }) => {
  const paramsString = params.toString();
  const uri = router.asPath.split('?')[0];

  const newPath = paramsString ? `${uri}?${params.toString()}` : uri;

  if (newPath != uri) {
    router.replace(newPath);
  }
};
