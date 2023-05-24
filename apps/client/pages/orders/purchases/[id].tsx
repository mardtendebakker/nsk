import Head from 'next/head';
import {
  Box, Button, IconButton, Typography, Card, CardContent, Divider, Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import {
  SyntheticEvent, useEffect, useMemo, useState,
} from 'react';
import Form from '../../../components/orders/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { PURCHASE_ORDERS_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from './new';
import { ORDERS_PURCHASES } from '../../../utils/routes';
import ProductsTable from '../../../components/orders/form/productsTable';
import { Product } from '../../../components/stock/createModal';

function UpdatePurchaseOrder() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState<{ [key:number]: Product }>({});

  const { call, performing } = useAxios(
    'patch',
    null,
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { call: fetchPurchaseOrder, performing: performingFetchPurchaseOrder, data: purchaseOrder } = useAxios(
    'get',
    PURCHASE_ORDERS_PATH.replace(':id', id.toString()),
    { withProgressBar: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans, purchaseOrder), [purchaseOrder]));

  useEffect(() => {
    if (id) {
      fetchPurchaseOrder()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(PURCHASE_ORDERS_PATH.replace(':id', 'new'));
          }
        });
    }
  }, [id]);

  const canSubmit = () => !performing && !performingFetchPurchaseOrder;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call({
      body: formRepresentationToBody(formRepresentation),
      path: PURCHASE_ORDERS_PATH.replace(':id', id.toString()),
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newPurchase')}
        </title>
      </Head>
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
          {trans('newPurchase')}
        </Typography>
        <Box>
          <Button
            sx={{ ml: '1.5rem' }}
            color="inherit"
            variant="outlined"
            onClick={() => router.push(ORDERS_PURCHASES)}
          >
            {trans('cancel')}
          </Button>
          <Button
            sx={{ ml: '1.5rem' }}
            variant="contained"
            onClick={handleSubmit}
          >
            <Check />
            {trans('savePurchase')}
          </Button>
        </Box>
      </Box>
      <Card>
        <Form
          formRepresentation={formRepresentation}
          disabled={!canSubmit()}
          onSubmit={handleSubmit}
          setValue={setValue}
        />
        <Divider sx={{ mx: '1.5rem' }} />
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
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
              <ProductsTable products={products} setProducts={setProducts} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default UpdatePurchaseOrder;