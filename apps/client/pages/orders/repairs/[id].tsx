import Head from 'next/head';
import {
  Box, Button, IconButton, Typography, Card, Divider, CardContent, Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import Form from '../../../components/orders/form/repair';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { REPAIR_ORDERS_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from './new';
import { ORDERS_REPAIRS, ORDERS_REPAIRS_NEW } from '../../../utils/routes';
import ProductsTable from '../../../components/orders/form/repair/productsTable';
import { Order } from '../../../utils/axios/models/order';

function UpdateRepairOrder() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const { call, performing } = useAxios(
    'put',
    REPAIR_ORDERS_PATH.replace(':id', id?.toString()),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { call: fetchRepairOrder, performing: performingFetchRepairOrder, data: repairOrder } = useAxios<Order>(
    'get',
    REPAIR_ORDERS_PATH.replace(':id', id?.toString()),
    { withProgressBar: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans, repairOrder), [repairOrder]));

  useEffect(() => {
    if (id) {
      fetchRepairOrder()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(ORDERS_REPAIRS_NEW);
          }
        });
    }
  }, [id]);

  const canSubmit = () => !performing && !performingFetchRepairOrder;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation) })
      .then(() => {
        fetchRepairOrder();
      });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('editRepair')}
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
            <IconButton onClick={() => router.push(ORDERS_REPAIRS)}>
              <ArrowBack />
            </IconButton>
            {trans('editRepair')}
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
                {id && <ProductsTable orderId={id.toString()} refreshOrder={() => fetchRepairOrder()} />}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </DashboardLayout>
  );
}

export default UpdateRepairOrder;
