import Head from 'next/head';
import { Box } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import CognitoList from '../../../components/admin/users/cognitoList';
import List from '../../../components/admin/users/list';
import DashboardLayout from '../../../layouts/dashboard';
import Header from '../../../components/admin/header';
import useSecurity from '../../../hooks/useSecurity';

function AdminUsers() {
  const { trans } = useTranslation();
  const { state: { user } } = useSecurity();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('admin')}</title>
      </Head>
      <Header />
      <Box sx={{ mt: '1.5rem' }} />
      {user.securitySystem == 'JWT' ? <List /> : <CognitoList />}
    </DashboardLayout>
  );
}

export default AdminUsers;
