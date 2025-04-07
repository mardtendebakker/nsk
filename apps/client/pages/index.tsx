import Head from 'next/head';
import {
  Box, Typography,
} from '@mui/material';
import useSecurity from '../hooks/useSecurity';
import useTranslation from '../hooks/useTranslation';
import DashboardLayout from '../layouts/dashboard';
import IndicatorRow from '../components/dashboard/IndicatorRow';
import LocationCapacity from '../components/dashboard/locationCapacity';
import ResourceManagement from '../components/dashboard/resourceManagement';
import DueToday from '../components/dashboard/dueToday';
import VehiclesTracking from '../components/dashboard/vehiclesTracking';
import Analytics from '../components/dashboard/analytics';
import { ORDERS_ANALYTICS_PATH } from '../utils/axios';
import useResponsive from '../hooks/useResponsive';

function Dashboard() {
  const { state: { user } } = useSecurity();
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('dashboard')}</title>
      </Head>
      <Typography variant="h3">
        {trans('hello')}
        {', '}
        {user?.username}
        !
      </Typography>
      <Box sx={{ m: '.5rem' }} />
      <IndicatorRow />
      <Box sx={{ mt: '.5rem', display: 'flex', flexDirection: isDesktop ? undefined : 'column-reverse' }}>
        <Box sx={{ flex: '.8', mr: '.5rem' }}>
          <Analytics label={trans('productAnalytics')} path={ORDERS_ANALYTICS_PATH} />
          <Box sx={{ m: '.5rem' }} />
          <LocationCapacity />
          <Box sx={{ m: '.5rem' }} />
          <ResourceManagement />
          <Box sx={{ m: '.5rem' }} />
          <DueToday />
        </Box>
        <Box sx={{ flex: '.2' }}>
          <VehiclesTracking />
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
