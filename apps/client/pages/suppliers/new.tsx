import Head from 'next/head';
import {
  Box, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { SyntheticEvent } from 'react';
import Form from '../../components/suppliers/form';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { Supplier, SUPPLIERS_PATH } from '../../utils/axios';
import { SUPPLIERS } from '../../utils/routes';
import useForm, { FormRepresentation } from '../../hooks/useForm';
import useTranslation from '../../hooks/useTranslation';

export function initFormState(supplier?: Supplier) {
  return {
    name: { required: true },
    representative: {},
    email: {},
    phone: {},
    phone2: {},
    street: {},
    street_extra: {},
    city: {},
    country: {},
    state: {},
    zip: {},
    street2: {},
    street_extra2: {},
    city2: {},
    country2: {},
    state2: {},
    zip2: {},
    partner: {},
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
    name: formRepresentation.name.value || undefined,
    representative: formRepresentation.representative.value || undefined,
    email: formRepresentation.email.value || undefined,
    phone: formRepresentation.phone.value || undefined,
    phone2: formRepresentation.phone2.value || undefined,
    street: formRepresentation.street.value || undefined,
    street_extra: formRepresentation.street_extra.value || undefined,
    city: formRepresentation.city.value || undefined,
    country: formRepresentation.country.value || undefined,
    state: formRepresentation.state.value || undefined,
    zip: formRepresentation.zip.value || undefined,
    street2: formRepresentation.street2.value || undefined,
    street_extra2: formRepresentation.street_extra2.value || undefined,
    city2: formRepresentation.city2.value || undefined,
    country2: formRepresentation.country2.value || undefined,
    state2: formRepresentation.state2.value || undefined,
    zip2: formRepresentation.zip2.value || undefined,
    partner: formRepresentation.partner.value || undefined,
  };
}

const formState = initFormState();

function PostSupplier() {
  const router = useRouter();
  const { trans } = useTranslation();

  const { call, performing } = useAxios(
    'post',
    null,
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(formState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || performing) {
      return;
    }

    call(
      {
        body: formRepresentationToBody(formRepresentation),
        path: SUPPLIERS_PATH.replace(':id', ''),
      },
      (err) => {
        if (!err) {
          router.push(SUPPLIERS);
        }
      },
    );
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newSupplier')}
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
          <IconButton onClick={() => router.push(SUPPLIERS)}>
            <ArrowBack />
          </IconButton>
          {trans('newSupplier')}
        </Typography>
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

export default PostSupplier;
