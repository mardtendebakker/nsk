import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { STOCK_REPAIR_SERVICES_PATH } from '../../../../utils/axios';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { STOCKS_REPAIR_SERVICES } from '../../../../utils/routes';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import Filter from './filter';

function initFormState(
  {
    search, orderBy, assignedTo, productType, productStatus,
  }:
  {
    search?: string,
    orderBy?: string,
    assignedTo?: string
    productType?: string,
    productStatus?: string,
  },
) {
  return {
    search: {
      value: search || '',
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
    productStatus: {
      value: productStatus || undefined,
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

  ['search', 'productType', 'productStatus'].forEach((filter) => {
    if (formRepresentation[filter].value || formRepresentation[filter].value === 0) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
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
      ...paramsToSend,
      orderBy: JSON.stringify(orderBy),
    },
  }).finally(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${STOCKS_REPAIR_SERVICES}?${params.toString()}` : STOCKS_REPAIR_SERVICES;

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
    orderBy: router.query?.orderBy?.toString(),
    assignedTo: router.query?.assignedTo?.toString(),
    productType: router.query?.productType?.toString(),
    productStatus: router.query?.productStatus?.toString(),
  }));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    STOCK_REPAIR_SERVICES_PATH.replace(':id', ''),
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
    formRepresentation.orderBy.value,
    formRepresentation.productType.value?.toString(),
    formRepresentation.productStatus.value?.toString(),
  ]);

  const handleReset = () => {
    setData(initFormState({}));
    setPage(1);
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
