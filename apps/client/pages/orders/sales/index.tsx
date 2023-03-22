import Head from 'next/head';
import { Box, Container } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import List from '../../../components/orders/sales/list';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/orders/header';

function SalesOrders() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('salesOrders')}</title>
      </Head>
      <Box
        component="main"
        sx={{ py: 8  }}
      >
        <Container maxWidth={false}>
          <Header />
          <Box sx={{ mt: '1.5rem' }} />
          <List />
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default SalesOrders;
