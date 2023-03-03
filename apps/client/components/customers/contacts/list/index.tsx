import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import List from './list';
import Filter from '../filter';
import useAxios from '../../../../hooks/useAxios';
import { CUSTOMERS_PATH } from '../../../../utils/axios';
import { CUSTOMERS_CONTACTS } from '../../../../utils/routes';
import useForm from '../../../../hooks/useForm';

function refreshList({
  page,
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();
  const where : { [key: string]: object; } = {};

  if (page) {
    params.append('page', page.toString());
  }

  if (formRepresentation.search.value) {
    const search = formRepresentation.search.value.toString();
    params.append('search', search);
  }

  if (formRepresentation.createdAt.value) {
    const createdAt = formRepresentation.createdAt.value.toString();
    params.append('createdAt', createdAt);
  }

  if (formRepresentation.status.value || formRepresentation.status.value === 0) {
    const status = formRepresentation.status.value.toString();
    params.append('status', status);
  }

  if (formRepresentation.listName.value || formRepresentation.listName.value === 0) {
    const listName = formRepresentation.listName.value.toString();
    params.append('listName', listName);
  }

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      where: JSON.stringify(where),
    },
  }).then(() => {
    router.replace(`${CUSTOMERS_CONTACTS}?${params.toString()}`);
  });
}

const debouncedRefreshList = _.debounce(refreshList, 500);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const status = parseInt(router.query?.status?.toString(), 10);
  const listName = parseInt(router.query?.listName?.toString(), 10);

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    createdAt: {
      value: router.query?.createdAt?.toString() || null,
    },
    status: {
      value: Number.isInteger(status) ? status : null,
    },
    listName: {
      value: Number.isInteger(listName) ? listName : null,
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
    debouncedRefreshList({
      page,
      formRepresentation,
      router,
      call,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    formRepresentation.search.value,
    formRepresentation.status.value,
    formRepresentation.listName.value,
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
        customers={data}
        count={Math.floor(count / 10)}
        page={page}
        onChecked={() => {}}
        onPageChanged={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
