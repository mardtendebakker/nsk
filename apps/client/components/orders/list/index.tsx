import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card } from '@mui/material';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import List from './list';
import useAxios from '../../../hooks/useAxios';
import { PURCHASE_ORDERS_PATH, SALES_ORDERS_PATH } from '../../../utils/axios';
import { ORDERS_PURCHASES } from '../../../utils/routes';
import Filter from '../filter';
import debounce from '../../../utils/debounce';

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

  ['status', 'search', 'partner', 'createdBy'].forEach((keyword) => {
    if (formRepresentation[keyword].value) {
      const value = formRepresentation[keyword].value.toString();
      params.append(keyword, value);
    }
  });

  const orderBy = {};

  ['orderBy'].forEach((keyword) => {
    if (formRepresentation[keyword].value) {
      const value = formRepresentation[keyword].value.toString();
      const [property, direction = 'desc'] = value.split(':');
      orderBy[property] = direction;
      params.append(keyword, value);
    }
  });

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      status: formRepresentation.status.value,
      search: formRepresentation.search.value,
      partner: formRepresentation.partner.value,
      createdBy: formRepresentation.createdBy.value,
      orderBy: JSON.stringify(orderBy),
    },
  }).then(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${router.pathname}?${params.toString()}` : router.pathname;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

const debouncedRefreshList = debounce(refreshList);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));

  const createdAt = parseInt(router.query?.createdAt?.toString(), 10);
  const orderBy = router.query?.orderBy?.toString();
  const status = router.query?.status?.toString();
  const partner = router.query?.partner?.toString();
  const createdBy = router.query?.createdBy?.toString();

  const isPurchasePage = router.pathname == ORDERS_PURCHASES;

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    createdAt: {
      value: Number.isInteger(createdAt) ? createdAt : null,
    },
    orderBy: {
      value: orderBy || undefined,
    },
    status: {
      value: status || undefined,
    },
    partner: {
      value: partner || undefined,
    },
    createdBy: {
      value: createdBy || undefined,
    },
  });

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    (isPurchasePage ? PURCHASE_ORDERS_PATH : SALES_ORDERS_PATH).replace(':id', ''),
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
  }, [formRepresentation.search.value]);

  useEffect(() => {
    refreshList({
      page,
      formRepresentation,
      router,
      call,
    });
  }, [
    page,
    formRepresentation.status.value?.toString(),
    formRepresentation.partner.value?.toString(),
    formRepresentation.createdBy.value?.toString(),
    formRepresentation.orderBy.value,
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
        orders={data}
        count={Math.floor(count / 10)}
        page={page}
        onChecked={() => {}}
        onPageChanged={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
