import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CUSTOMERS_CONTACTS, CUSTOMERS_CONTACTS_EDIT, SUPPLIERS_CONTACTS_EDIT } from '../../../../utils/routes';
import List from './list';
import Filter from './filter';
import useAxios from '../../../../hooks/useAxios';
import { CUSTOMERS_PATH, SUPPLIERS_PATH } from '../../../../utils/axios';
import useForm, { FieldPayload } from '../../../../hooks/useForm';

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
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.append('page', page.toString());
  }

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
      take: 10,
      skip: (page - 1) * 10,
      ...paramsToSend,
    },
  }).finally(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${router.pathname}?${params.toString()}` : router.pathname;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: router.query?.search?.toString(),
    createdAt: router.query?.createdAt?.toString(),
    representative: router.query?.representative?.toString(),
    list: router.query?.list?.toString(),
  }));

  const ajaxPath = router.pathname == CUSTOMERS_CONTACTS ? CUSTOMERS_PATH : SUPPLIERS_PATH;

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
      formRepresentation,
      router,
      call,
    });
  }, [
    page,
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
        count={Math.ceil(count / 10)}
        page={page}
        onDelete={handleDelete}
        onEdit={(id) => router.push(
          (router.pathname == CUSTOMERS_CONTACTS ? CUSTOMERS_CONTACTS_EDIT : SUPPLIERS_CONTACTS_EDIT).replace(':id', id.toString()),
        )}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
