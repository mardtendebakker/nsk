import Head from 'next/head';
import {
  Box, Button, IconButton, Typography, Card, CardContent, Divider, Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import {
  SyntheticEvent, useEffect, useMemo,
} from 'react';
import Form from '../../../components/orders/form/purchase';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { PURCHASE_ORDERS_FILES_PATH, PURCHASE_ORDERS_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from './new';
import { ORDERS_PURCHASES, ORDERS_PURCHASES_NEW } from '../../../utils/routes';
import ProductsTable from '../../../components/orders/form/purchase/productsTable';
import { AFile } from '../../../utils/axios/models/aFile';
import { Order } from '../../../utils/axios/models/order';

function UpdatePurchaseOrder() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const { call, performing } = useAxios(
    'put',
    PURCHASE_ORDERS_PATH.replace(':id', id?.toString()),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { call: fetchPurchaseOrder, performing: performingFetchPurchaseOrder, data: purchaseOrder } = useAxios<undefined | Order>(
    'get',
    PURCHASE_ORDERS_PATH.replace(':id', id?.toString()),
    { withProgressBar: true },
  );

  const { call: deleteFile, performing: performingDeleteFilte } = useAxios(
    'delete',
    PURCHASE_ORDERS_FILES_PATH
      .replace(':orderId', id?.toString())
      .replace(':id', ''),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans, purchaseOrder), [purchaseOrder]));

  useEffect(() => {
    if (id) {
      fetchPurchaseOrder()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(ORDERS_PURCHASES_NEW.replace(':id', 'new'));
          }
        });
    }
  }, [id]);

  const canSubmit = () => !performing && !performingFetchPurchaseOrder && !performingDeleteFilte;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation) })
      .then(() => {
        fetchPurchaseOrder();
      });
  };

  const handleDeleteFile = (file: AFile) => {
    deleteFile({ body: [file.id] })
      .then(() => {
        fetchPurchaseOrder();
      });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('editPurchase')}
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
            <IconButton onClick={() => router.push(ORDERS_PURCHASES)}>
              <ArrowBack />
            </IconButton>
            {trans('editPurchase')}
          </Typography>
          <Box>
            <Button
              size="small"
              variant="contained"
              onClick={handleSubmit}
            >
              <Check />
              {trans('save')}
            </Button>
          </Box>
        </Box>
        <Card>
          <Form
            onFileDelete={handleDeleteFile}
            order={purchaseOrder}
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
                { id && <ProductsTable orderId={id.toString()} /> }
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </DashboardLayout>
  );
}

export default UpdatePurchaseOrder;
