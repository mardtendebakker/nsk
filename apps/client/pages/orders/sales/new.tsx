import Head from 'next/head';
import {
  Box, Button, IconButton, Typography, Card,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useMemo } from 'react';
import Form from '../../../components/orders/form/sales';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { AxiosResponse, SALES_ORDERS_PATH } from '../../../utils/axios';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { ORDERS_SALES, ORDERS_SALES_EDIT } from '../../../utils/routes';
import { Order } from '../../../utils/axios/models/order';

function requiredCustomerFieldValidator(field: string, trans) {
  return (formRepresentation: FormRepresentation) => {
    if (formRepresentation.newCustomer.value && !formRepresentation[field].value) {
      return trans('requiredField');
    }
  };
}

export function initFormState(trans, order?: Order) {
  return {
    orderNr: { value: order?.order_nr },
    orderDate: { value: order?.order_date ? new Date(order?.order_date) : new Date(), required: true },
    orderStatus: { required: true, value: order?.status_id },
    remarks: { value: order?.remarks },
    transport: { value: order?.transport },
    totalPrice: { value: order?.totalPrice },
    discount: { value: order?.discount },
    isGift: { value: !!order?.is_gift },
    deliveryDate: { value: order?.delivery_date, required: true },
    deliveryType: { value: order?.delivery_type, required: true },
    deliveryInstructions: { value: order?.delivery_instructions },
    partnerId: { value: order?.contact_aorder_customer_idTocontact?.contact?.id },
    customerId: {
      validator: (formRepresentation: FormRepresentation) => {
        if (!formRepresentation.newCustomer.value && formRepresentation.customerId.value == undefined) {
          return trans('requiredField');
        }
      },
      value: order?.customer_id,
    },
    newCustomer: { value: false },
    name: {},
    company_name: { validator: requiredCustomerFieldValidator('company_name', trans) },
    company_kvk_nr: {},
    email: { validator: requiredCustomerFieldValidator('email', trans) },
    phone: { validator: requiredCustomerFieldValidator('phone', trans) },
    street: { validator: requiredCustomerFieldValidator('street', trans) },
    extraStreet: {},
    city: { validator: requiredCustomerFieldValidator('city', trans) },
    zipcode: {},
    state: {},
    country: {},
    totalPerProductType: { value: order?.totalPerProductType },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  const payload: any = {
    order_nr: formRepresentation.orderNr.value || undefined,
    order_date: formRepresentation.orderDate.value || undefined,
    status_id: formRepresentation.orderStatus.value || undefined,
    remarks: formRepresentation.remarks.value,
    transport: formRepresentation.transport.value,
    discount: formRepresentation.discount.value,
    is_gift: formRepresentation.isGift.value,
    delivery_date: formRepresentation.deliveryDate.value || undefined,
    delivery_type: formRepresentation.deliveryType.value,
    delivery_instructions: formRepresentation.deliveryInstructions.value || undefined,
  };

  if (!formRepresentation.newCustomer.value) {
    payload.customer_id = formRepresentation.customerId.value || undefined;
  } else {
    payload.customer = {
      name: formRepresentation.name.value || undefined,
      company_name: formRepresentation.company_name.value || undefined,
      company_kvk_nr: formRepresentation.company_kvk_nr.value || undefined,
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

function NewSalesOrder() {
  const { trans } = useTranslation();
  const router = useRouter();

  const { call, performing } = useAxios(
    'post',
    SALES_ORDERS_PATH.replace(':id', ''),
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
      router.push(ORDERS_SALES_EDIT.replace('[id]', response.data.id));
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newSales')}
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
            {trans('newSales')}
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
            disabled={performing}
            setValue={setValue}
          />
        </Card>
      </form>
    </DashboardLayout>
  );
}

export default NewSalesOrder;
