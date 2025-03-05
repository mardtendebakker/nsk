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
import { requiredCompanyFieldValidator } from '../purchases/new';

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
    transportInclVat: {
      value: order?.transport
      // eslint-disable-next-line no-unsafe-optional-chaining
        ? (order?.transport * 1 + (order?.vat_rate || 0 / 100))
        : 0,
    },
    totalPrice: { value: order?.totalPrice },
    totalPriceExtVat: { value: order?.totalPriceExtVat },
    vatValue: { value: order?.vatValue },
    vat: { value: order?.vat_rate || 0 },
    vatFactor: { value: 1 + (order?.vat_rate || 0) / 100 },
    discount: { value: order?.discount },
    isGift: { value: !!order?.is_gift },
    deliveryDate: { value: order?.delivery?.date },
    deliveryType: { value: order?.delivery?.type, required: true },
    deliveryInstructions: { value: order?.delivery?.instructions },
    dhlTrackingCode: { value: order?.delivery?.dhl_tracking_code, originalValue: order?.delivery?.dhl_tracking_code },
    customerId: {
      validator: (formRepresentation: FormRepresentation) => {
        if (!formRepresentation.newCustomer.value && formRepresentation.customerId.value == undefined) {
          return trans('requiredField');
        }
      },
      value: order?.customer_id,
    },
    newCustomer: { value: false },
    companyId: {
      validator: (formRepresentation: FormRepresentation): string | undefined | null => {
        if (formRepresentation.newCustomer.value && !formRepresentation.newCompany.value && !formRepresentation.companyId.value) {
          return trans('requiredField');
        }
      },
      value: order?.contact_aorder_customer_idTocontact?.company_id,
    },
    newCompany: { value: false },
    companyName: {
      validator: (formRepresentation: FormRepresentation): string | undefined | null => {
        if (formRepresentation.newCompany.value && !formRepresentation.companyName.value) {
          return trans('requiredField');
        }
      },
    },
    logisticId: {
      value: order?.delivery?.logistics_id,
    },
    companyKvkNr: {},
    companyIsPartner: { value: false },
    companyPartner: {},
    companyVatCode: { validator: requiredCompanyFieldValidator('companyVatCode', trans) },
    name: {},
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
    order_nr: formRepresentation.orderNr.value,
    order_date: formRepresentation.orderDate.value,
    status_id: formRepresentation.orderStatus.value,
    remarks: formRepresentation.remarks.value,
    transport: formRepresentation.transport.value,
    discount: formRepresentation.discount.value,
    is_gift: formRepresentation.isGift.value,
    delivery: {
      date: formRepresentation.deliveryDate.value || null,
      type: formRepresentation.deliveryType.value,
      instructions: formRepresentation.deliveryInstructions.value,
      logistics_id: formRepresentation.logisticId.value || null,
      dhl_tracking_code: formRepresentation.dhlTrackingCode.value || null,
    },
  };

  if (!formRepresentation.newCustomer.value) {
    payload.customer_id = formRepresentation.customerId.value;
  } else {
    payload.customer = {
      name: formRepresentation.name.value,
      email: formRepresentation.email.value,
      phone: formRepresentation.phone.value,
      street: formRepresentation.street.value,
      street_extra: formRepresentation.extraStreet.value,
      city: formRepresentation.city.value,
      zip: formRepresentation.zipcode.value,
      state: formRepresentation.state.value,
      country: formRepresentation.country.value,
    };

    if (!formRepresentation.newCompany.value) {
      payload.customer.company_id = formRepresentation.companyId.value;
    } else {
      payload.customer.company_name = formRepresentation.companyName.value;
      payload.customer.company_kvk_nr = formRepresentation.companyKvkNr.value;
      payload.customer.company_is_partner = formRepresentation.companyIsPartner.value;
      payload.customer.company_partner_id = formRepresentation.companyPartner.value;
      payload.supplier.company_vat_code = formRepresentation.companyVatCode.value;
    }
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
            disabled={performing}
            setValue={setValue}
          />
        </Card>
      </form>
    </DashboardLayout>
  );
}

export default NewSalesOrder;
