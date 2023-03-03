import Head from 'next/head';
import { Box, Container } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import List from '../../../components/orders/purchases/list';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/orders/header';

function OrdersPurchases() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('purchaseOrders')}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
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

export default OrdersPurchases;
