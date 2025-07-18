import Head from 'next/head';
import useTranslation from '../../../hooks/useTranslation';
import List from '../../../components/stock/list';
import DashboardLayout from '../../../layouts/dashboard';

function OutOfStock() {
  const { trans } = useTranslation();

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('stock')}</title>
      </Head>
      <List type="outOfStock" />
    </DashboardLayout>
  );
}

export default OutOfStock;
