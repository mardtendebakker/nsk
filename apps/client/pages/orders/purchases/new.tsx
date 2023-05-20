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
import { PURCHASE_ORDERS_PATH } from '../../../utils/axios';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { STOCKS_PRODUCTS } from '../../../utils/routes';

function requiredSupplierFieldValidator(field: string, trans) {
  return (formRepresentation: FormRepresentation) => {
    if (formRepresentation.newSupplier.value && !formRepresentation[field].value) {
      return trans('requiredField');
    }
  };
}

export function dataInputsFormatter(trans) {
  return {
    orderNr: { required: true },
    orderDate: { value: new Date(), required: true },
    orderStatus: { required: true },
    remarks: {},
    transportCost: { value: '0' },
    discount: { value: '0' },
    isGift: { value: false },
    supplierId: {
      validator: (formRepresentation: FormRepresentation) => {
        if (!formRepresentation.newSupplier.value && formRepresentation.supplierId.value == undefined) {
          return trans('requiredField');
        }
      },
    },
    newSupplier: { value: false },
    name: { validator: requiredSupplierFieldValidator('name', trans) },
    kvkNr: {},
    representative: {},
    email: { validator: requiredSupplierFieldValidator('email', trans) },
    phone: { validator: requiredSupplierFieldValidator('phone', trans) },
    street: { validator: requiredSupplierFieldValidator('street', trans) },
    extraStreet: {},
    city: { validator: requiredSupplierFieldValidator('city', trans) },
    zipcode: {},
    state: {},
    country: {},
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  const payload: any = {
    orderNr: formRepresentation.orderNr.value || undefined,
    orderDate: formRepresentation.orderDate.value || undefined,
    orderStatus: formRepresentation.orderStatus.value || undefined,
    remarks: formRepresentation.remarks.value || undefined,
    transportCost: formRepresentation.transportCost.value || undefined,
    discount: formRepresentation.discount.value || undefined,
    isGift: formRepresentation.isGift.value || undefined,
  };

  if (!formRepresentation.newSupplier.value) {
    payload.supplierId = formRepresentation.supplierId.value || undefined;
  } else {
    payload.supplier = {
      name: formRepresentation.name.value || undefined,
      kvkNr: formRepresentation.kvkNr.value || undefined,
      representative: formRepresentation.representative.value || undefined,
      email: formRepresentation.email.value || undefined,
      phone: formRepresentation.phone.value || undefined,
      street: formRepresentation.street.value || undefined,
      extraStreet: formRepresentation.extraStreet.value || undefined,
      city: formRepresentation.city.value || undefined,
      zipcode: formRepresentation.zipcode.value || undefined,
      state: formRepresentation.state.value || undefined,
      country: formRepresentation.country.value || undefined,
    };
  }

  return payload;
}

function NewStockProduct() {
  const { trans } = useTranslation();
  const router = useRouter();

  const { call, performing } = useAxios(
    'post',
    null,
    { withProgressBar: true, showSuccessMessage: true },
  );

  const initFormState = useMemo(dataInputsFormatter.bind(null, trans), []) as FormRepresentation;

  const { formRepresentation, setValue, validate } = useForm(initFormState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (validate() || performing) {
      return;
    }

    call(
      {
        body: formRepresentationToBody(formRepresentation),
        path: PURCHASE_ORDERS_PATH.replace(':id', ''),
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
          disabled={performing}
          onSubmit={handleSubmit}
          setValue={setValue}
        />
      </Card>
    </DashboardLayout>
  );
}

export default NewStockProduct;
