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

export function dataInputsFormatter(supplier?: Supplier) {
  return {
    name: {
      value: supplier?.name || '',
      required: true,
    },
    representative: {
      value: supplier?.representative || '',
    },
    email: {
      value: supplier?.email || '',
    },
    phone: {
      value: supplier?.phone || '',
    },
    phone2: {
      value: supplier?.phone2 || '',
    },
    street: {
      value: supplier?.street || '',
    },
    street_extra: {
      value: supplier?.street_extra || '',
    },
    city: {
      value: supplier?.city || '',
    },
    country: {
      value: supplier?.country || '',
    },
    state: {
      value: supplier?.state || '',
    },
    zip: {
      value: supplier?.zip || '',
    },
    street2: {
      value: supplier?.street2 || '',
    },
    street_extra2: {
      value: supplier?.street_extra2 || '',
    },
    city2: {
      value: supplier?.city2 || '',
    },
    country2: {
      value: supplier?.country2 || '',
    },
    state2: {
      value: supplier?.state2 || '',
    },
    zip2: {
      value: supplier?.zip2 || '',
    },
    partner: {
      value: supplier?.partner || '',
    },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
    name: formRepresentation.name.value,
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

const initFormState = dataInputsFormatter();

function PostSupplier() {
  const router = useRouter();
  const { trans } = useTranslation();

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
