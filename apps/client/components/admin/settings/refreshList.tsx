import { NextRouter } from 'next/router';
import { Call } from '../../../hooks/useAxios';

export default function refreshList({
  page,
  router,
  call,
  search,
}: {
  page: number,
  router: NextRouter,
  call: Call,
  search?: string
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.append('page', page.toString());
  }

  if (search) {
    params.append('search', search.toString());
  }

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      search,
    },
  }).finally(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${router.pathname}?${params.toString()}` : router.pathname;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}
