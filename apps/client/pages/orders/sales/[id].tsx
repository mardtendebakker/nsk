import Head from 'next/head';
import {
  Box, Button, IconButton, Typography, Card, Divider, CardContent, Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import Form from '../../../components/orders/form/sales';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { SALES_ORDERS_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from './new';
import { ORDERS_SALES, ORDERS_SALES_NEW } from '../../../utils/routes';
import ProductsTable from '../../../components/orders/form/sales/productsTable';

function UpdateSalesOrder() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const { call, performing } = useAxios(
    'put',
    SALES_ORDERS_PATH.replace(':id', id?.toString()),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { call: fetchSalesOrder, performing: performingFetchSalesOrder, data: salesOrder } = useAxios(
    'get',
    SALES_ORDERS_PATH.replace(':id', id?.toString()),
    { withProgressBar: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans, salesOrder), [salesOrder]));

  useEffect(() => {
    if (id) {
      fetchSalesOrder()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(ORDERS_SALES_NEW);
          }
        });
    }
  }, [id]);

  const canSubmit = () => !performing && !performingFetchSalesOrder;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation) });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('editSales')}
        </title>
      </Head>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mb: 2,
          }}
        >
          <Typography variant="h4">
            <IconButton onClick={() => router.push(ORDERS_SALES)}>
              <ArrowBack />
            </IconButton>
            {trans('editSales')}
          </Typography>
          <Box>
            <Button
              size="small"
              sx={{ ml: '1.5rem' }}
              color="inherit"
              variant="outlined"
              onClick={() => router.push(ORDERS_SALES)}
            >
              {trans('cancel')}
            </Button>
            <Button
              size="small"
              sx={{ ml: '1.5rem' }}
              variant="contained"
              onClick={handleSubmit}
            >
              <Check />
              {trans('saveSales')}
            </Button>
          </Box>
        </Box>
        <Card>
          <Form
            formRepresentation={formRepresentation}
            disabled={!canSubmit()}
            setValue={setValue}
          />
          <Divider sx={{ mx: '1.5rem' }} />
          <CardContent>
            <Typography
              sx={{ mb: '1rem' }}
              variant="h4"
            >
              {trans('addProducts')}
            </Typography>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                { id && <ProductsTable orderId={id.toString()} /> }
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </DashboardLayout>
  );
}

export default UpdateSalesOrder;
