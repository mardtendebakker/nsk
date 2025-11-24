import Head from 'next/head';
import {
  Box, IconButton, Typography, Card, Divider, CardContent, Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import {
  SyntheticEvent, useEffect, useMemo, useState,
} from 'react';
import Form from '../../../components/orders/form/sales';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { SALES_ORDERS_FILES_PATH, SALES_ORDERS_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from './new';
import { ORDERS_SALES, ORDERS_SALES_NEW } from '../../../utils/routes';
import ProductsTable from '../../../components/orders/form/sales/productsTable';
import { Order } from '../../../utils/axios/models/order';
import Action from '../../../components/orders/form/action';
import { AFile } from '../../../utils/axios/models/aFile';

function UpdateSalesOrder() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [performingAction, setPerformingAction] = useState(false);

  const { call, performing } = useAxios(
    'put',
    SALES_ORDERS_PATH.replace(':id', id?.toString()),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { call: fetchSalesOrder, performing: performingFetchSalesOrder, data: salesOrder } = useAxios<undefined | Order>(
    'get',
    SALES_ORDERS_PATH.replace(':id', id?.toString()),
    { withProgressBar: true },
  );

  const { call: deleteFile, performing: performingDeleteFilte } = useAxios(
    'delete',
    SALES_ORDERS_FILES_PATH
      .replace(':orderId', id?.toString())
      .replace(':id', ''),
    { withProgressBar: true, showSuccessMessage: true },
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

  const canSubmit = () => !performing && !performingFetchSalesOrder && !performingAction && !performingDeleteFilte;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation), headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => {
        fetchSalesOrder();
      });
  };

  const handleDeleteFile = (file: AFile) => {
    deleteFile({ body: [file.id] })
      .then(() => {
        fetchSalesOrder();
      });
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
          <Action
            order={salesOrder}
            disabled={!canSubmit()}
            onSave={handleSubmit}
            onPerformingAction={setPerformingAction}
            id={id?.toString()}
            type="sales"
          />
        </Box>
        <Card>
          <Form
            onFileDelete={handleDeleteFile}
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
              spacing={1}
            >
              <Grid
                item
                xs={12}
              >
                {id && <ProductsTable orderId={id.toString()} refreshOrder={() => fetchSalesOrder()} vatFactor={formRepresentation.vatFactor.value} />}
              </Grid>
            </Grid>
            <Action
              order={salesOrder}
              disabled={!canSubmit()}
              onSave={handleSubmit}
              onPerformingAction={setPerformingAction}
              id={id?.toString()}
              type="sales"
            />
          </CardContent>
        </Card>
      </form>
    </DashboardLayout>
  );
}

export default UpdateSalesOrder;
