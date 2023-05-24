import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../../hooks/useAxios';
import { USERS_PATH } from '../../../../utils/axios';
import { ADMIN_USERS } from '../../../../utils/routes';
import useForm, { FieldPayload } from '../../../../hooks/useForm';

function initFormState(
  {
    search, createdAt, createdBy, lastActive, role,
  }:
  { search?: string, createdAt?: string, createdBy?: string, lastActive?: string, role?: string },
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
    role: {
      value: role || undefined,
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

  ['search', 'createdAt', 'createdBy', 'lastActive', 'role'].forEach((filter) => {
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
    const newPath = paramsString ? `${ADMIN_USERS}?${params.toString()}` : ADMIN_USERS;

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
    createdBy: router.query?.createdBy?.toString(),
    lastActive: router.query?.createdBy?.toString(),
    role: router.query?.role?.toString(),
  }));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    USERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
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
    formRepresentation.role.value,
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
        users={data}
        count={Math.ceil(count / 10)}
        page={page}
        onCheck={() => {}}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
