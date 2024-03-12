import Head from 'next/head';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useTranslation from '../../../hooks/useTranslation';
import Logistics from '../../../components/logistics';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/logistics/header';
import { DASHBOARD } from '../../../utils/routes';
import useSecurity from '../../../hooks/useSecurity';

export function useHasLogistics() {
  const { hasModule } = useSecurity();
  const hasLogistics = hasModule('logistics');
  const router = useRouter();

  useEffect(() => {
    if (!hasLogistics) {
      router.replace(DASHBOARD);
    }
  }, []);

  return hasLogistics;
}

function LogisticsPickups() {
  const { trans } = useTranslation();
  const hasLogistics = useHasLogistics();

  return hasLogistics ? (
    <DashboardLayout>
      <Head>
        <title>{trans('pickups')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <Logistics type="pickup" />
    </DashboardLayout>
  ) : <div />;
}

export default LogisticsPickups;
