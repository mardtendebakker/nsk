import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import Logistics from '../../../components/logistics';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/logistics/header';
import { useHasLogistics } from '../pickups';

function LogisticsDeliveries() {
  const { trans } = useTranslation();
  const hasLogistics = useHasLogistics();

  return hasLogistics ? (
    <DashboardLayout>
      <Head>
        <title>{trans('deliveries')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <Logistics type="delivery" />
    </DashboardLayout>
  ) : <div />;
}

export default LogisticsDeliveries;
