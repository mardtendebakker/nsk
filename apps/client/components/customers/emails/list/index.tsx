import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../../hooks/useAxios';
import { CUSTOMERS_PATH } from '../../../../utils/axios';
import { CUSTOMERS_EMAILS } from '../../../../utils/routes';
import useForm from '../../../../hooks/useForm';

function refreshList({
  page,
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.append('page', page.toString());
  }

  const paramsToSend = {};

  ['search', 'createdAt', 'status'].forEach((filter) => {
    if (formRepresentation[filter].value || formRepresentation[filter].value === 0) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
    }
  });

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      ...paramsToSend,
    },
  }).finally(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${CUSTOMERS_EMAILS}?${params.toString()}` : CUSTOMERS_EMAILS;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const status = router.query?.status?.toString();

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    createdAt: {
      value: router.query?.createdAt?.toString() || null,
    },
    status: {
      value: status || undefined,
    },
  });

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    CUSTOMERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    /* refreshList({
      page,
      formRepresentation,
      router,
      call,
    }); */
  }, [
    page,
    formRepresentation.search.value,
    formRepresentation.status.value,
    formRepresentation.createdAt.value,
  ]);

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
        disabled={performing}
        formRepresentation={formRepresentation}
        setValue={setValue}
      />
      <Box sx={{ m: '1rem' }} />
      <List
        emails={[]}
        count={Math.ceil(count / 10)}
        page={page}
        onCheck={() => {}}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
