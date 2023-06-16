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
import { AxiosResponse, PURCHASE_ORDERS_PATH } from '../../../utils/axios';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { ORDERS_PURCHASES, ORDERS_PURCHASES_EDIT } from '../../../utils/routes';
import { Order } from '../../../utils/axios/models/order';

function requiredSupplierFieldValidator(field: string, trans) {
  return (formRepresentation: FormRepresentation) => {
    if (formRepresentation.newSupplier.value && !formRepresentation[field].value) {
      return trans('requiredField');
    }
  };
}

export function initFormState(trans, order?: Order) {
  return {
    orderNr: { required: true, value: order?.order_nr },
    orderDate: { value: order?.order_date ? new Date(order?.order_date) : new Date(), required: true },
    pickupDate: { value: order?.pickup_date ? new Date(order?.pickup_date) : new Date() },
    orderStatus: { required: true, value: order?.status_id },
    remarks: { value: order?.remarks },
    transport: { value: order?.transport },
    discount: { value: order?.discount },
    isGift: { value: !!order?.is_gift },
    supplierId: {
      validator: (formRepresentation: FormRepresentation) => {
        if (!formRepresentation.newSupplier.value && formRepresentation.supplierId.value == undefined) {
          return trans('requiredField');
        }
      },
      value: order?.supplier_id,
    },
    logisticId: {
      value: order?.logistic_id,
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
    order_nr: formRepresentation.orderNr.value || undefined,
    order_date: formRepresentation.orderDate.value || undefined,
    pickup_date: formRepresentation.pickupDate.value || undefined,
    status_id: formRepresentation.orderStatus.value || undefined,
    remarks: formRepresentation.remarks.value || undefined,
    transport: formRepresentation.transport.value || undefined,
    discount: formRepresentation.discount.value || undefined,
    is_gift: formRepresentation.isGift.value || undefined,
    logistic_id: formRepresentation.logisticId.value || undefined,
  };

  if (!formRepresentation.newSupplier.value) {
    payload.supplier_id = formRepresentation.supplierId.value || undefined;
  } else {
    payload.supplier = {
      name: formRepresentation.name.value || undefined,
      kvk_nr: formRepresentation.kvkNr.value || undefined,
      representative: formRepresentation.representative.value || undefined,
      email: formRepresentation.email.value || undefined,
      phone: formRepresentation.phone.value || undefined,
      street: formRepresentation.street.value || undefined,
      street_extra: formRepresentation.extraStreet.value || undefined,
      city: formRepresentation.city.value || undefined,
      zip: formRepresentation.zipcode.value || undefined,
      state: formRepresentation.state.value || undefined,
      country: formRepresentation.country.value || undefined,
    };
  }

  return payload;
}

function NewPurchaseOrder() {
  const { trans } = useTranslation();
  const router = useRouter();

  const { call, performing } = useAxios(
    'post',
    PURCHASE_ORDERS_PATH.replace(':id', ''),
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
    }).then((response: AxiosResponse) => {
      router.push(ORDERS_PURCHASES_EDIT.replace(':id', response.data.id));
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newPurchase')}
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
              type="submit"
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
      </form>
    </DashboardLayout>
  );
}

export default NewPurchaseOrder;
