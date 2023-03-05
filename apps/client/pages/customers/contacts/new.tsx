import Head from 'next/head';
import {
  Box, Button, Checkbox, Container, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import Form from '../../../components/customers/contacts/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { Customer, CUSTOMERS_PATH } from '../../../utils/axios';
import { CUSTOMERS_CONTACTS } from '../../../utils/routes';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';

export function dataInputsFormatter(customer?: Customer) {
  return {
    name: {
      value: customer?.name || '',
      required: true,
    },
    representative: {
      value: customer?.representative || '',
    },
    kvk_nr: {
      value: customer?.kvk_nr || '',
    },
    email: {
      value: customer?.email || '',
    },
    phone: {
      value: customer?.phone || '',
    },
    phone2: {
      value: customer?.phone2 || '',
    },
    street: {
      value: customer?.street || '',
    },
    street_extra: {
      value: customer?.street_extra || '',
    },
    city: {
      value: customer?.city || '',
    },
    country: {
      value: customer?.country || '',
    },
    state: {
      value: customer?.state || '',
    },
    zip: {
      value: customer?.zip || '',
    },
    street2: {
      value: customer?.street2 || '',
    },
    street_extra2: {
      value: customer?.street_extra2 || '',
    },
    city2: {
      value: customer?.city2 || '',
    },
    country2: {
      value: customer?.country2 || '',
    },
    state2: {
      value: customer?.state2 || '',
    },
    zip2: {
      value: customer?.zip2 || '',
    },
    is_partner: {
      value: customer?.is_partner || '',
    },
  };
}

const initFormState = dataInputsFormatter();

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
    name: formRepresentation.name.value,
    representative: formRepresentation.representative.value || undefined,
    kvk_nr: formRepresentation.kvk_nr.value || undefined,
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
    is_partner: formRepresentation.is_partner.value || false,
  };
}

function NewCustomerContact() {
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
        path: CUSTOMERS_PATH.replace(':id', ''),
      },
      (err) => {
        if (!err) {
          router.push(CUSTOMERS_CONTACTS);
        }
      },
    );
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newContact')}
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
              <IconButton onClick={() => router.push(CUSTOMERS_CONTACTS)}>
                <ArrowBack />
              </IconButton>
              {trans('newContact')}
            </Typography>
            <Box>
              <Checkbox checked={!!formRepresentation.is_partner.value} onChange={(_, checked) => setValue({ field: 'is_partner', value: checked })} />
              {trans('isPartner')}
              <Button
                sx={{ ml: '1.5rem' }}
                variant="contained"
                onClick={handleSubmit}
              >
                <Check />
                {trans('saveContact')}
              </Button>
            </Box>
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

export default NewCustomerContact;
