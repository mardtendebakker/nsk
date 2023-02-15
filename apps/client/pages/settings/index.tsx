import Head from 'next/head';
import { Box, Container } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import DashboardLayout from '../../layouts/dashboard';
import PasswordForm from './PasswordForm';

function Settings() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('settings')}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
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
