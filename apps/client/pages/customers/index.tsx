import Head from 'next/head';
import { Box, Button, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import List from '../../components/customers/list';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { CUSTOMERS_PATH } from '../../utils/axios';
import { CUSTOMERS } from '../../utils/routes';

function Customers() {
  const TAKE = 10;
  const router = useRouter();
  const { trans } = useTranslation();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    CUSTOMERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    router.replace(`${CUSTOMERS.replace(':id', '')}?page=${page}`);
    call({ params: { take: TAKE, skip: (page - 1) * TAKE } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onEdit = (customerId: number) => router.push(CUSTOMERS_PATH.replace(':id', customerId.toString()));

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('customers')}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" onClick={() => router.push(CUSTOMERS.replace(':id', 'new'))}>
              {trans('newCustomer')}
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <List
              onEdit={onEdit}
              customers={data}
              count={count}
              page={page - 1}
              rowsPerPage={TAKE}
              onPageChange={(newPage) => setPage(newPage + 1)}
            />
          </Box>
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default Customers;
