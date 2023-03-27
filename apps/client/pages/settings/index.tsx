import Head from 'next/head';
import { Box, Container } from '@mui/material';
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
      <Box
        component="main"
        sx={{ py: 8 }}
      >
        <Container maxWidth={false}>
          {/* temporary style */}
          <Box sx={{ width: 450 }}>
            <PasswordForm />
          </Box>
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default Settings;
