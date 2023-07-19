import Head from 'next/head';
import {
  Box, Button, Typography,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
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
import { ORDERS_PURCHASES_NEW } from '../utils/routes';

function Dashboard() {
  const { state: { user } } = useSecurity();
  const { trans } = useTranslation();
  const router = useRouter();

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
        <Button
          size="small"
          variant="contained"
          onClick={() => router.push(ORDERS_PURCHASES_NEW)}
        >
          <Add />
          {trans('newPurchase')}
        </Button>
      </Box>
      <Box sx={{ m: '.5rem' }} />
      <IndicatorRow />
      <Box sx={{ mt: '.5rem', display: 'flex' }}>
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
          <UpcomingDeliveries />
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
