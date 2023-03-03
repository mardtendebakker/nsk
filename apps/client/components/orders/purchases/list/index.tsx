import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { PURCHASE_ORDERS_PATH } from '../../../../utils/axios';
import { ORDERS_PURCHASES } from '../../../../utils/routes';

export default function ListContainer() {
  const TAKE = 10;
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    PURCHASE_ORDERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    router.replace(`${ORDERS_PURCHASES}?page=${page}`);
    call({ params: { take: TAKE, skip: (page - 1) * TAKE } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <List
      purchaseOrders={data}
      count={Math.floor(count / 10)}
      page={page}
      onChecked={() => {}}
      onPageChanged={(newPage) => setPage(newPage)}
    />
  );
}
