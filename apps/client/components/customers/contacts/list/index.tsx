import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../../hooks/useAxios';
import { CUSTOMERS_PATH } from '../../../../utils/axios';
import { CUSTOMERS_CONTACTS } from '../../../../utils/routes';
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

  if (formRepresentation.representative.value) {
    const representative = formRepresentation.representative.value.toString();
    where.representative = { contains: representative };
    params.append('representative', representative);
  }

  if (formRepresentation.list.value || formRepresentation.list.value === 0) {
    const list = formRepresentation.list.value.toString();
    params.append('list', list);
  }

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      where: JSON.stringify(where),
    },
  }).then(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${CUSTOMERS_CONTACTS}?${params.toString()}` : CUSTOMERS_CONTACTS;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

const debouncedRefreshList = debounce(refreshList);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const list = parseInt(router.query?.list?.toString(), 10);

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    createdAt: {
      value: router.query?.createdAt?.toString() || null,
    },
    representative: {
      value: router.query?.representative?.toString() || '',
    },
    list: {
      value: Number.isInteger(list) ? list : null,
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
  }, [
    page,
    formRepresentation.search.value,
    formRepresentation.createdAt.value,
    formRepresentation.representative.value,
    formRepresentation.list.value,
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
        customers={data}
        count={Math.floor(count / 10)}
        page={page}
        onChecked={() => {}}
        onPageChanged={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
