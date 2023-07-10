import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/contacts/header';
import List from '../../../components/contacts/list';

function ContactsCustomers() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('customers')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <List />
    </DashboardLayout>
  );
}

export default ContactsCustomers;
