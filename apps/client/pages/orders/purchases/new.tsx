import Head from 'next/head';
import {
  Box, Button, IconButton, Typography, Card,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useMemo } from 'react';
import Form from '../../../components/orders/form/purchase';
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
    orderNr: { value: order?.order_nr },
    orderDate: { value: order?.order_date ? new Date(order?.order_date) : new Date(), required: true },
    pickupDate: { value: order?.pickup?.real_pickup_date ? new Date(order?.pickup?.real_pickup_date) : '' },
    orderStatus: { required: true, value: order?.status_id },
    remarks: { value: order?.remarks },
    transport: { value: order?.transport },
    totalPrice: { value: order?.totalPrice },
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
      value: order?.pickup?.logistics_id,
    },
    newSupplier: { value: false },
    name: {},
    companyId: {
      validator: (formRepresentation: FormRepresentation): string | undefined | null => {
        if (formRepresentation.newSupplier.value && !formRepresentation.newCompany.value && !formRepresentation.companyId.value) {
          return trans('requiredField');
        }
      },
      value: order?.contact_aorder_supplier_idTocontact?.company_id,
    },
    newCompany: { value: false },
    companyName: {
      validator: (formRepresentation: FormRepresentation): string | undefined | null => {
        if (formRepresentation.newCompany.value && !formRepresentation.companyName.value) {
          return trans('requiredField');
        }
      },
    },
    companyKvkNr: {},
    companyIsPartner: { value: false },
    companyPartner: {},
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
    order_nr: formRepresentation.orderNr.value,
    order_date: formRepresentation.orderDate.value,
    status_id: formRepresentation.orderStatus.value,
    remarks: formRepresentation.remarks.value,
    transport: formRepresentation.transport.value,
    discount: formRepresentation.discount.value,
    is_gift: formRepresentation.isGift.value,
    pickup: {
      logistics_id: formRepresentation.logisticId.value || null,
      real_pickup_date: formRepresentation.pickupDate.value,
    },
  };

  if (!formRepresentation.newSupplier.value) {
    payload.supplier_id = formRepresentation.supplierId.value;
  } else {
    payload.supplier = {
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
      payload.supplier.company_id = formRepresentation.companyId.value;
    } else {
      payload.supplier.company_name = formRepresentation.companyName.value;
      payload.supplier.company_kvk_nr = formRepresentation.companyKvkNr.value;
      payload.supplier.company_is_partner = formRepresentation.companyIsPartner.value;
      payload.supplier.company_partner_id = formRepresentation.companyPartner.value;
    }
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
      router.push(ORDERS_PURCHASES_EDIT.replace('[id]', response.data.id));
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

export default NewPurchaseOrder;
