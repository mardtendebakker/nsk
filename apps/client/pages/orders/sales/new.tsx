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
import { AFile } from '../../../utils/axios/models/aFile';

function requiredCustomerFieldValidator(field: string, trans) {
  return (formRepresentation: FormRepresentation) => {
    if (formRepresentation.newCustomer.value && !formRepresentation[field].value) {
      return trans('requiredField');
    }
  };
}

export function initFormState(trans, order?: Order) {
  let agreementAFile: AFile | undefined;
  const picturesAFiles: { [key: string]: AFile } = {};

  order?.delivery?.afile?.forEach((aFile: AFile, key) => {
    if (aFile.discr == 'pa') {
      agreementAFile = aFile;
    } else if (aFile.discr == 'pi') {
      picturesAFiles[key] = aFile;
    }
  });

  return {
    orderNr: { value: order?.order_nr },
    orderDate: { value: order?.order_date ? new Date(order?.order_date) : new Date(), required: true },
    orderStatus: { required: true, value: order?.status_id },
    remarks: { value: order?.remarks },
    transport: { value: order?.transport },
    transportInclVat: {
      value: order?.transport
        ? order.transport * (1 + (order?.vat_rate || 0) / 100)
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
    vehicleId: {
      value: order?.delivery?.vehicle_id,
    },
    driverId: {
      value: order?.delivery?.driver_id,
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
    agreementAFile: { value: agreementAFile },
    picturesAFiles: { value: picturesAFiles },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  const formData = new FormData();

  // Add basic order fields
  formData.append('order_nr', formRepresentation.orderNr.value);
  formData.append('order_date', formRepresentation.orderDate.value);
  formData.append('status_id', formRepresentation.orderStatus.value);
  formData.append('remarks', formRepresentation.remarks.value);
  formData.append('transport', formRepresentation.transport.value);
  formData.append('discount', formRepresentation.discount.value);
  formData.append('is_gift', formRepresentation.isGift.value.toString());

  if (formRepresentation.deliveryDate.value) {
    formData.append('delivery.date', formRepresentation.deliveryDate.value);
  }
  /* formData.append('delivery', JSON.stringify({
    date: formRepresentation.deliveryDate.value || null,
    type: formRepresentation.deliveryType.value,
    instructions: formRepresentation.deliveryInstructions.value,
    vehicle_id: formRepresentation.vehicleId.value || null,
    driver_id: formRepresentation.driverId.value || null,
    dhl_tracking_code: formRepresentation.dhlTrackingCode.value || null,
  })); */

  /*
  if (formRepresentation.deliveryDate.value) {
    formData.append('delivery.date', formRepresentation.deliveryDate.value);
  }
  formData.append('delivery.type', formRepresentation.deliveryType.value);
  formData.append('delivery.instructions', formRepresentation.deliveryInstructions.value);

  if (formRepresentation.vehicleId.value) {
    formData.append('delivery.vehicle_id', formRepresentation.vehicleId.value);
  }

  if (formRepresentation.driverId.value) {
    formData.append('delivery.driver_id', formRepresentation.driverId.value);
  }

  if (formRepresentation.dhlTrackingCode.value) {
    formData.append('delivery.dhl_tracking_code', formRepresentation.dhlTrackingCode.value);
  } */

  // Handle customer information
  if (!formRepresentation.newCustomer.value) {
    // Existing customer
    formData.append('customer_id', formRepresentation.customerId.value);
  } else {
    // New customer
    formData.append('customer.name', formRepresentation.name.value);
    formData.append('customer.email', formRepresentation.email.value);
    formData.append('customer.phone', formRepresentation.phone.value);
    formData.append('customer.street', formRepresentation.street.value);
    formData.append('customer.street_extra', formRepresentation.extraStreet.value);
    formData.append('customer.city', formRepresentation.city.value);
    formData.append('customer.zip', formRepresentation.zipcode.value);
    formData.append('customer.state', formRepresentation.state.value);
    formData.append('customer.country', formRepresentation.country.value);

    // Handle company information
    if (!formRepresentation.newCompany.value) {
      // Existing company
      formData.append('customer.company_id', formRepresentation.companyId.value);
    } else {
      // New company
      formData.append('customer.company_name', formRepresentation.companyName.value);
      formData.append('customer.company_kvk_nr', formRepresentation.companyKvkNr.value);
      formData.append('customer.company_is_partner', formRepresentation.companyIsPartner.value.toString());
      formData.append('customer.company_partner_id', formRepresentation.companyPartner.value);
      formData.append('customer.company_vat_code', formRepresentation.companyVatCode.value);
    }
  }

  return formData;
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
      headers: { 'Content-Type': 'multipart/form-data' },
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
