import Head from 'next/head';
import { Box, Typography } from '@mui/material';
import useTranslation from '../hooks/useTranslation';
import DashboardLayout from '../layouts/dashboard';
import List from '../components/myTasks/list';

export default function MyTasks() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('myTasks')}</title>
      </Head>
      <Typography variant="h3">{trans('myTasks')}</Typography>
      <Box sx={{ mt: '1.5rem' }} />
      <List />
    </DashboardLayout>
  );
}
