import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { STOCK_REPAIR_SERVICES_PATH } from '../../../../utils/axios';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { STOCKS_REPAIR_SERVICES } from '../../../../utils/routes';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import Filter from './filter';
import debounce from '../../../../utils/debounce';

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

  ['search', 'productType'].forEach((keyword) => {
    if (formRepresentation[keyword].value || formRepresentation[keyword].value === 0) {
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
      orderBy: JSON.stringify(orderBy),
      productType: formRepresentation.productType.value,
      search: formRepresentation.search.value,
    },
  }).then(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${STOCKS_REPAIR_SERVICES}?${params.toString()}` : STOCKS_REPAIR_SERVICES;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

const debouncedRefreshList = debounce(refreshList);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const productType = router.query?.productType?.toString();
  const taskStatus = router.query?.taskStatus?.toString();
  const assignedTo = router.query?.assignedTo?.toString();
  const orderBy = router.query?.orderBy?.toString();

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    orderBy: {
      value: orderBy || undefined,
    },
    assignedTo: {
      value: assignedTo || undefined,
    },
    productType: {
      value: productType || undefined,
    },
    taskStatus: {
      value: taskStatus || undefined,
    },
  });

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    STOCK_REPAIR_SERVICES_PATH.replace(':id', ''),
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
    formRepresentation.orderBy.value,
    formRepresentation.productType.value?.toString(),
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
        stockRepairServices={data}
        count={Math.floor(count / 10)}
        page={page}
        onChecked={() => {}}
        onPageChanged={(newPage) => setPage(newPage)}
      />
    </Card>
  );
}
