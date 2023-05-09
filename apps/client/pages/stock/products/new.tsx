import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import Form from '../../../components/stock/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { Product, STOCK_PRODUCTS_PATH } from '../../../utils/axios';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { STOCKS_PRODUCTS } from '../../../utils/routes';

export function dataInputsFormatter(product?: Product) {
  return { };
}

const initFormState = dataInputsFormatter();

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return { };
}

function NewStockProduct() {
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
        path: STOCK_PRODUCTS_PATH.replace(':id', ''),
      },
      (err) => {
        if (!err) {
          router.push(STOCKS_PRODUCTS);
        }
      },
    );
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
          <IconButton onClick={() => router.push(STOCKS_PRODUCTS)}>
            <ArrowBack />
          </IconButton>
          {trans('newPurchase')}
        </Typography>
        <Box>
          <Button
            sx={{ ml: '1.5rem' }}
            color="inherit"
            variant="outlined"
            onClick={() => router.push(STOCKS_PRODUCTS)}
          >
            {trans('cancel')}
          </Button>
          <Button
            sx={{ ml: '1.5rem' }}
            variant="outlined"
            onClick={() => {}}
          >
            {trans('print')}
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
      <Form
        formRepresentation={formRepresentation}
        disabled={performing}
        onSubmit={handleSubmit}
        setValue={setValue}
      />
    </DashboardLayout>
  );
}

export default NewStockProduct;
