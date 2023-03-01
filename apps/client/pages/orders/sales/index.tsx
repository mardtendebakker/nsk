import Head from 'next/head';
import {
  Box, Button, Container, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Add from '@mui/icons-material/Add';
import useTranslation from '../../../hooks/useTranslation';
import List from '../../../components/orders/sales/list';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { SALES_ORDERS_PATH } from '../../../utils/axios';
import { SALES_ORDERS } from '../../../utils/routes';
import Navigation from '../../../components/orders/navigation';

function SalesOrders() {
  const TAKE = 10;
  const router = useRouter();
  const { trans } = useTranslation();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    SALES_ORDERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    router.replace(`${SALES_ORDERS}?page=${page}`);
    call({ params: { take: TAKE, skip: (page - 1) * TAKE } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('salesOrders')}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ mr: '.5rem' }}>{trans('orders')}</Typography>
              <Navigation />
            </Box>
            <Button variant="contained" onClick={() => router.push(SALES_ORDERS.replace(':id', 'new'))}>
              <Add />
              {trans('newSalesOrder')}
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <List
              salesOrders={data}
              count={Math.floor(count / 10)}
              page={page}
              onChecked={() => {}}
              onPageChanged={(newPage) => setPage(newPage)}
            />
          </Box>
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default SalesOrders;
