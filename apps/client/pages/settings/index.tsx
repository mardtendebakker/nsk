import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import DashboardLayout from '../../layouts/dashboard';
import PasswordForm from '../../components/settings/passwordForm';

function Settings() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('settings')}</title>
      </Head>
      <Box sx={{ maxWidth: 450 }}>
        <PasswordForm />
      </Box>
    </DashboardLayout>
  );
}

export default Settings;
