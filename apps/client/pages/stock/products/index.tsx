import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import List from '../../../components/stock/list';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/stock/header';

function Products() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('stock')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <List />
    </DashboardLayout>
  );
}

export default Products;
