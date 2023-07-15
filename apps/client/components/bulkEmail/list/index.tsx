import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../hooks/useAxios';
import { CUSTOMERS_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';
import pushURLParams from '../../../utils/pushURLParams';

function refreshList({
  page,
  rowsPerPage = 10,
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
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      ...paramsToSend,
    },
  }).finally(pushURLParams({ params, router }));
}

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(router.query?.rowsPerPage?.toString() || '10', 10));
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
      rowsPerPage,
      formRepresentation,
      router,
      call,
    }); */
  }, [
    page,
    rowsPerPage,
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
        disabled={performing}
        emails={[]}
        count={Math.ceil(count / 10)}
        page={page}
        onCheck={() => {}}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
        rowsPerPage={rowsPerPage}
      />
    </Card>
  );
}
