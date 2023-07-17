import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CONTACTS_CUSTOMERS, CONTACTS_CUSTOMERS_EDIT, CONTACTS_SUPPLIERS_EDIT } from '../../../utils/routes';
import List from './list';
import Filter from './filter';
import useAxios from '../../../hooks/useAxios';
import { CUSTOMERS_PATH, SUPPLIERS_PATH } from '../../../utils/axios';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import pushURLParams from '../../../utils/pushURLParams';

function initFormState(
  {
    search, createdAt, representative, list,
  }:
  { search?: string, createdAt?: string, representative?: string, list?: string },
) {
  return {
    search: {
      value: search,
    },
    createdAt: {
      value: createdAt || null,
    },
    representative: {
      value: representative,
    },
    list: {
      value: list || undefined,
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

  ['search', 'createdAt', 'representative', 'list'].forEach((filter) => {
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
  }).finally(() => pushURLParams({ params, router }));
}

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(router.query?.rowsPerPage?.toString() || '10', 10));

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: router.query?.search?.toString(),
    createdAt: router.query?.createdAt?.toString(),
    representative: router.query?.representative?.toString(),
    list: router.query?.list?.toString(),
  }));

  const ajaxPath = router.pathname == CONTACTS_CUSTOMERS ? CUSTOMERS_PATH : SUPPLIERS_PATH;

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
      showSuccessMessage: true,
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
    formRepresentation.representative.value,
    formRepresentation.list.value?.toString(),
  ]);

  const handleReset = () => {
    setPage(1);
    setData(initFormState({}));
  };

  const handleDelete = (id: number) => {
    callDelete({ path: ajaxPath.replace(':id', id.toString()) })
      .then(() => {
        refreshList({
          page,
          rowsPerPage,
          formRepresentation,
          router,
          call,
        });
      });
  };

  const disabled = (): boolean => performing || performingDelete;

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
        onReset={handleReset}
        disabled={disabled()}
        formRepresentation={formRepresentation}
        setValue={(payload: FieldPayload) => {
          setValue(payload);
          setPage(1);
        }}
      />
      <Box sx={{ m: '1rem' }} />
      <List
        disabled={disabled()}
        companies={data}
        count={count}
        page={page}
        onDelete={handleDelete}
        onEdit={(id) => router.push(
          (router.pathname == CONTACTS_CUSTOMERS ? CONTACTS_CUSTOMERS_EDIT : CONTACTS_SUPPLIERS_EDIT).replace(':id', id.toString()),
        )}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
        rowsPerPage={rowsPerPage}
      />
    </Card>
  );
}
