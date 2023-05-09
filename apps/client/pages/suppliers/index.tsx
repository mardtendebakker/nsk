import Head from 'next/head';
import {
  Box, Button, Typography,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from '../../components/suppliers/list';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { SUPPLIERS_PATH } from '../../utils/axios';
import { SUPPLIERS, SUPPLIERS_NEW } from '../../utils/routes';
import useTranslation from '../../hooks/useTranslation';

function Suppliers() {
  const TAKE = 10;
  const router = useRouter();
  const { trans } = useTranslation();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    SUPPLIERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    router.replace(page > 1 ? `${SUPPLIERS}?page=${page}}` : SUPPLIERS);
    call({ params: { take: TAKE, skip: (page - 1) * TAKE } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('suppliers')}</title>
      </Head>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3">{trans('suppliers')}</Typography>
        <Button variant="contained" onClick={() => router.push(SUPPLIERS_NEW)}>
          <Add />
          {trans('newSupplier')}
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <List
          suppliers={data}
          count={Math.floor(count / 10)}
          page={page}
          onCheck={() => {}}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </Box>
    </DashboardLayout>
  );
}

export default Suppliers;
