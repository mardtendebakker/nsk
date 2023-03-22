import Head from 'next/head';
import { Box, Container } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import List from '../../../components/customers/emails/list';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/customers/header';

function CustomersEmails() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('customers')}</title>
      </Head>
      <Box
        component="main"
        sx={{ py: 8  }}
      >
        <Container maxWidth={false}>
          <Header />
          <Box sx={{ mt: '1.5rem' }} />
          <List />
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default CustomersEmails;
