import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/admin/header';
import SettingsContainer from '../../../components/admin/logistics/settingsContainer';
import List from '../../../components/admin/logistics/drivers/list';

function AdminDrivers() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('admin')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <SettingsContainer>
        <List />
      </SettingsContainer>
    </DashboardLayout>
  );
}

export default AdminDrivers;
