import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import Logistics from '../../../components/logistics';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/logistics/header';

function LogisticsDeliveries() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('deliveries')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <Logistics type="delivery" />
    </DashboardLayout>
  );
}

export default LogisticsDeliveries;
