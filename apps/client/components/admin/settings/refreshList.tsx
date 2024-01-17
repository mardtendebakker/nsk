import { NextRouter } from 'next/router';
import pushURLParams from '../../../utils/pushURLParams';
import { Call } from '../../../hooks/useAxios';

export default function refreshList({
  page,
  rowsPerPage = 10,
  router,
  call,
  search,
}: {
  page: number,
  rowsPerPage: number,
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

  params.append('rowsPerPage', rowsPerPage.toString());

  call({
    params: {
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      search,
    },
  }).then(() => pushURLParams({ params, router })).catch(() => {});
}
