import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { trans } from 'itranslator';
import { useRouter } from 'next/router';
import List from '../../components/suppliers/List';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { SUPPLIERS_PATH } from '../../utils/axios';
import { SUPPLIERS } from '../../utils/routes';

function Suppliers() {
  const TAKE = 10;
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const { data: { data = [], count = 0 } = {}, call } = useAxios(
    'get',
    SUPPLIERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    router.replace(`${SUPPLIERS.replace(':id', '')}?page=${page}`);
    call({ params: { take: TAKE, skip: (page - 1) * TAKE } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('suppliers')}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mt: 3 }}>
            <List
              suppliers={data}
              count={count}
              page={page - 1}
              rowsPerPage={TAKE}
              onPageChange={setPage}
            />
          </Box>
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default Suppliers;
