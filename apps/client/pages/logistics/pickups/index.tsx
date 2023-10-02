import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import Logistics from '../../../components/logistics';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/logistics/header';

function LogisticsPickups() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('pickups')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <Logistics type="pickup" />
    </DashboardLayout>
  );
}

export default LogisticsPickups;
