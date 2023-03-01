import Head from 'next/head';
import {
  Box, Container, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { SyntheticEvent } from 'react';
import Form from '../../components/salesOrders/form';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { SalesOrder, SALES_ORDERS_PATH } from '../../utils/axios';
import { SALES_ORDERS } from '../../utils/routes';
import useForm, { FormRepresentation } from '../../hooks/useForm';
import useTranslation from '../../hooks/useTranslation';

export function dataInputsFormatter(salesOrder?: SalesOrder) {
  return {
    order_nr: {
      value: salesOrder?.order_nr || '',
    },
    remarks: {
      value: salesOrder?.remarks || '',
    },
    order_date: {
      value: salesOrder?.order_nr || new Date().toISOString(),
      required: true,
    },
    transport: {
      value: salesOrder?.transport || 0,
    },
    discount: {
      value: salesOrder?.transport || 0,
    },
  };
}

const initFormState = dataInputsFormatter();

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
    order_nr: formRepresentation.order_nr.value || undefined,
    remarks: formRepresentation.remarks.value || undefined,
    order_date: formRepresentation.order_date.value || undefined,
  };
}

function PostSalesOrder() {
  const { trans } = useTranslation();
  const router = useRouter();

  const { call, performing } = useAxios(
    'post',
    null,
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(initFormState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || performing) {
      return;
    }

    call(
      {
        body: formRepresentationToBody(formRepresentation),
        path: SALES_ORDERS_PATH.replace(':id', ''),
      },
      (err) => {
        if (!err) {
          router.push(SALES_ORDERS.replace(':id', ''));
        }
      },
    );
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newSalesOrder')}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
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
              <IconButton onClick={() => router.push(SALES_ORDERS.replace(':id', ''))}>
                <ArrowBack />
              </IconButton>
              {trans('newSalesOrder')}
            </Typography>
          </Box>
          <Form
            formRepresentation={formRepresentation}
            disabled={performing}
            onSubmit={handleSubmit}
            setValue={setValue}
          />
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default PostSalesOrder;
