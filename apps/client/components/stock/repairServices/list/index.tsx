import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { STOCK_REPAIR_SERVICES_PATH } from '../../../../utils/axios';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { STOCKS_REPAIR_SERVICES } from '../../../../utils/routes';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import Filter from './filter';

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
    where.name = { contains: search };
    params.append('search', search);
  }

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      where: JSON.stringify(where),
    },
  }).then(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${STOCKS_REPAIR_SERVICES}?${params.toString()}` : STOCKS_REPAIR_SERVICES;

    if (newPath !== router.pathname) {
      router.replace(newPath);
    }
  });
}

const debouncedRefreshList = _.debounce(refreshList, 500);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const type = parseInt(router.query?.type?.toString(), 10);
  const taskStatus = parseInt(router.query?.taskStatus?.toString(), 10);
  const assignedTo = parseInt(router.query?.assignedTo?.toString(), 10);
  const sortBy = parseInt(router.query?.sortBy?.toString(), 10);

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    sortBy: {
      value: Number.isInteger(sortBy) ? sortBy : null,
    },
    assignedTo: {
      value: Number.isInteger(assignedTo) ? assignedTo : null,
    },
    type: {
      value: Number.isInteger(type) ? type : null,
    },
    taskStatus: {
      value: Number.isInteger(taskStatus) ? taskStatus : null,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    formRepresentation.search.value,
    formRepresentation.sortBy.value,
    formRepresentation.type.value,
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
