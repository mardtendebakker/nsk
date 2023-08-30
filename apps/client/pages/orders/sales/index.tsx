import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import List from '../../../components/orders/list';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/orders/header';

function SalesOrders() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('salesOrders')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <List type="sales" />
    </DashboardLayout>
  );
}

export default SalesOrders;
