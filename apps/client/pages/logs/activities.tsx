import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import DashboardLayout from '../../layouts/dashboard';
import LogsContainer from '../../components/logs/logsContainer';
import List from '../../components/logs/activity/list';

function ActivityLogs() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('activityLogs')}</title>
      </Head>
      <Box sx={{ mt: '1.5rem' }} />
      <LogsContainer>
        <List />
      </LogsContainer>
    </DashboardLayout>
  );
}

export default ActivityLogs;
