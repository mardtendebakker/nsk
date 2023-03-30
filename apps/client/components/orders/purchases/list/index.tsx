import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card } from '@mui/material';
import _ from 'lodash';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { PURCHASE_ORDERS_PATH } from '../../../../utils/axios';
import { ORDERS_PURCHASES } from '../../../../utils/routes';
import Filter from '../../filter';

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
    where.name = { contains: search };
    params.append('search', search);
  }

  [].forEach((keyword) => {
    if (formRepresentation[keyword].value || formRepresentation[keyword].value === 0) {
      const value = formRepresentation[keyword].value.toString();
      params.append(keyword, value);
    }
  });

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      where: JSON.stringify(where),
    },
  }).then(() => {
    router.replace(`${ORDERS_PURCHASES}?${params.toString()}`);
  });
}

const debouncedRefreshList = _.debounce(refreshList, 500);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));

  const createdAt = parseInt(router.query?.createdAt?.toString(), 10);
  const createdBy = parseInt(router.query?.createdBy?.toString(), 10);
  const sortBy = parseInt(router.query?.sortBy?.toString(), 10);
  const status = parseInt(router.query?.status?.toString(), 10);
  const partner = parseInt(router.query?.partner?.toString(), 10);

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    createdAt: {
      value: Number.isInteger(createdAt) ? createdAt : null,
    },
    createdBy: {
      value: Number.isInteger(createdBy) ? createdBy : null,
    },
    sortBy: {
      value: Number.isInteger(sortBy) ? sortBy : null,
    },
    status: {
      value: Number.isInteger(status) ? status : null,
    },
    partner: {
      value: Number.isInteger(partner) ? partner : null,
    },
  });

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    PURCHASE_ORDERS_PATH.replace(':id', ''),
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
      <Box sx={{ m: '1.5rem' }} />
      <List
        purchaseOrders={data}
        count={Math.floor(count / 10)}
        page={page}
        onChecked={() => {}}
        onPageChanged={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
