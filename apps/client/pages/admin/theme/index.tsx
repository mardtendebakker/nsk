import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/admin/header';
import Theme from '../../../components/admin/theme';

function AdminTheme() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('admin')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <Theme />
    </DashboardLayout>
  );
}

export default AdminTheme;
