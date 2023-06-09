import Head from 'next/head';
import {
  Box, Button, Typography,
} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import useSecurity from '../hooks/useSecurity';
import useTranslation from '../hooks/useTranslation';
import DashboardLayout from '../layouts/dashboard';
import IndicatorRow from '../components/dashboard/IndicatorRow';
import LocationCapacity from '../components/dashboard/locationCapacity';
import ResourceManagement from '../components/dashboard/resourceManagement';
import DueToday from '../components/dashboard/dueToday';
import UpcomingDeliveries from '../components/dashboard/upcomingDeliveries';
import Analytics from '../components/dashboard/analytics';
import { ORDERS_ANALYTICS_PATH } from '../utils/axios';

function Dashboard() {
  const { state: { user } } = useSecurity();
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('customers')}</title>
      </Head>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3">
          {trans('hello')}
          {', '}
          {user?.username}
          !
        </Typography>
        <Button variant="contained">
          {trans('createOrder')}
          <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
        </Button>
      </Box>
      <Box sx={{ m: '2rem' }} />
      <IndicatorRow />
      <Box sx={{ mt: '2rem', display: 'flex' }}>
        <Box sx={{ flex: '.8', mr: '2rem' }}>
          <Analytics label={trans('productAnalytics')} path={ORDERS_ANALYTICS_PATH} />
          <Box sx={{ m: '2rem' }} />
          <LocationCapacity />
          <Box sx={{ m: '2rem' }} />
          <ResourceManagement />
          <Box sx={{ m: '2rem' }} />
          <DueToday />
        </Box>
        <Box sx={{ flex: '.2' }}>
          <UpcomingDeliveries />
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
