import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { STOCKS_REPAIR_SERVICES } from '../../../../utils/routes';
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

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      where: JSON.stringify(where),
    },
  }).then(() => {
    router.replace(`${STOCKS_REPAIR_SERVICES}?${params.toString()}`);
  });
}

const debouncedRefreshList = _.debounce(refreshList, 500);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const list = parseInt(router.query?.list?.toString(), 10);

  const { formRepresentation } = useForm({
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

  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    'REPAIR_SERVICES_PATH'.replace(':id', ''),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
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
