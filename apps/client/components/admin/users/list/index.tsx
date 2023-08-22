import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../../hooks/useAxios';
import { ADMIN_USERS_PATH } from '../../../../utils/axios';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import pushURLParams from '../../../../utils/pushURLParams';
import { getQueryParam } from '../../../../utils/location';

function initFormState(
  {
    search, createdAt, createdBy, lastActive,
  }:
  { search?: string, createdAt?: string, createdBy?: string, lastActive?: string },
) {
  return {
    search: {
      value: search || '',
    },
    createdAt: {
      value: createdAt || null,
    },
    createdBy: {
      value: createdBy || undefined,
    },
    lastActive: {
      value: lastActive || undefined,
    },
  };
}

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

  params.append('rowsPerPage', rowsPerPage.toString());

  const paramsToSend = {};

  ['search', 'createdAt', 'createdBy', 'lastActive'].forEach((filter) => {
    if (formRepresentation[filter].value || formRepresentation[filter].value === 0) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
    }
  });

  call({
    params: {
      limit: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      ...paramsToSend,
    },
  }).finally(() => pushURLParams({ params, router }));
}

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: getQueryParam('search'),
    createdAt: getQueryParam('createdAt'),
    createdBy: getQueryParam('createdBy'),
    lastActive: getQueryParam('lastActive'),
  }));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    ADMIN_USERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    refreshList({
      page,
      rowsPerPage,
      formRepresentation,
      router,
      call,
    });
  }, [
    page,
    rowsPerPage,
    formRepresentation.search.value,
    formRepresentation.createdAt.value,
    formRepresentation.lastActive.value,
    formRepresentation.createdBy.value,
  ]);

  const handleReset = () => {
    setPage(1);
    setData(initFormState({}));
  };

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
        onReset={handleReset}
        disabled={performing}
        formRepresentation={formRepresentation}
        setValue={(payload: FieldPayload) => {
          setValue(payload);
          setPage(1);
        }}
      />
      <Box sx={{ m: '1rem' }} />
      <List
        disabled={performing}
        users={data}
        count={count}
        page={page}
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
