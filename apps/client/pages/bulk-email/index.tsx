import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import List from '../../components/bulkEmail/list';
import DashboardLayout from '../../layouts/dashboard';
import Header from '../../components/bulkEmail/header';

function BulkEmails() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('suppliers')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <List />
    </DashboardLayout>
  );
}

export default BulkEmails;
