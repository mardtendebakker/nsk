import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import DashboardLayout from '../../layouts/dashboard';
import Header from '../../components/companies/header';
import List from '../../components/companies/list';

function Companies() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('companies')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <List />
    </DashboardLayout>
  );
}

export default Companies;
