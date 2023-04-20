import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../../hooks/useAxios';
import { USERS_PATH } from '../../../../utils/axios';
import { ADMIN_USERS } from '../../../../utils/routes';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import debounce from '../../../../utils/debounce';

function refreshList({
  page,
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();
  const where : { [key: string]: object; } = {};

  if (page > 1) {
    params.append('page', page.toString());
  }

  if (formRepresentation.search.value) {
    const search = formRepresentation.search.value.toString();
    where.OR = [
      { email: { contains: search } },
      { name: { contains: search } },
    ];
    params.append('search', search);
  }

  if (formRepresentation.createdAt.value) {
    const createdAt = formRepresentation.createdAt.value.toString();
    params.append('createdAt', createdAt);
  }

  if (formRepresentation.createdBy.value || formRepresentation.createdBy.value === 0) {
    const createdBy = formRepresentation.createdBy.value.toString();
    params.append('createdBy', createdBy);
  }

  if (formRepresentation.lastActive.value || formRepresentation.lastActive.value === 0) {
    const lastActive = formRepresentation.lastActive.value.toString();
    params.append('lastActive', lastActive);
  }

  if (formRepresentation.role.value || formRepresentation.role.value === 0) {
    const role = formRepresentation.role.value.toString();
    params.append('role', role);
  }

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      where: JSON.stringify(where),
    },
  }).then(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${ADMIN_USERS}?${params.toString()}` : ADMIN_USERS;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

const debouncedRefreshList = debounce(refreshList);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const createdBy = parseInt(router.query?.createdBy?.toString(), 10);
  const lastActive = parseInt(router.query?.createdBy?.toString(), 10);
  const role = parseInt(router.query?.role?.toString(), 10);

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    createdAt: {
      value: router.query?.createdAt?.toString() || null,
    },
    createdBy: {
      value: Number.isInteger(createdBy) ? createdBy : null,
    },
    lastActive: {
      value: Number.isInteger(lastActive) ? lastActive : null,
    },
    role: {
      value: Number.isInteger(role) ? role : null,
    },
  });

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    USERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    /* debouncedRefreshList({
      page,
      formRepresentation,
      router,
      call,
    }); */
  }, [
    page,
    formRepresentation.search.value,
    formRepresentation.createdAt.value,
    formRepresentation.role.value,
    formRepresentation.lastActive.value,
    formRepresentation.createdBy.value,
  ]);

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
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
        count={Math.floor(count / 10)}
        page={page}
        onChecked={() => {}}
        onPageChanged={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
