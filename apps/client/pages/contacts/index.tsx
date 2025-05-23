import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';
import DashboardLayout from '../../layouts/dashboard';
import Header from '../../components/contacts/header';
import List from '../../components/contacts/list';
import { ContactListItem } from '../../utils/axios/models/contact';
import { CONTACTS_EDIT } from '../../utils/routes';

function Contacts() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('suppliers')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      <List
        editContactRouteBuilder={(contact: ContactListItem) => CONTACTS_EDIT.replace('[id]', contact.id.toString())}
      />
    </DashboardLayout>
  );
}

export default Contacts;
