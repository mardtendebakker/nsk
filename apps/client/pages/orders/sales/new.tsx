import Head from 'next/head';
import {
  Box, Button, IconButton, Typography, Card,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useMemo } from 'react';
import Form from '../../../components/orders/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { AxiosResponse, SALES_ORDERS_PATH } from '../../../utils/axios';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from '../purchases/new';
import { ORDERS_SALES, ORDERS_SALES_EDIT } from '../../../utils/routes';

function NewSalesOrder() {
  const { trans } = useTranslation();
  const router = useRouter();

  const { call, performing } = useAxios(
    'post',
    null,
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans), []));

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (validate() || performing) {
      return;
    }

    call({
      body: formRepresentationToBody(formRepresentation),
      path: SALES_ORDERS_PATH.replace(':id', ''),
    }).then((response: AxiosResponse) => {
      router.push(ORDERS_SALES_EDIT.replace(':id', response.data.id));
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newSale')}
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
          <IconButton onClick={() => router.push(ORDERS_SALES)}>
            <ArrowBack />
          </IconButton>
          {trans('newSale')}
        </Typography>
        <Box>
          <Button
            sx={{ ml: '1.5rem' }}
            color="inherit"
            variant="outlined"
            onClick={() => router.push(ORDERS_SALES)}
          >
            {trans('cancel')}
          </Button>
          <Button
            sx={{ ml: '1.5rem' }}
            variant="contained"
            onClick={handleSubmit}
          >
            <Check />
            {trans('saveSale')}
          </Button>
        </Box>
      </Box>
      <Card>
        <Form
          formRepresentation={formRepresentation}
          disabled={performing}
          onSubmit={handleSubmit}
          setValue={setValue}
        />
      </Card>
    </DashboardLayout>
  );
}

export default NewSalesOrder;
