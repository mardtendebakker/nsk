import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import Form from '../../../components/companies/contacts/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { AxiosResponse, CUSTOMERS_PATH } from '../../../utils/axios';
import { CUSTOMERS_CONTACTS, CUSTOMERS_CONTACTS_EDIT } from '../../../utils/routes';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { Company } from '../../../utils/axios/models/company';

export function initFormState(company?: Company) {
  return {
    name: {
      value: company?.name,
      required: true,
    },
    representative: {
      value: company?.representative,
    },
    kvk_nr: {
      value: company?.kvk_nr,
    },
    email: {
      value: company?.email,
    },
    phone: {
      value: company?.phone,
    },
    phone2: {
      value: company?.phone2,
    },
    street: {
      value: company?.street,
    },
    street_extra: {
      value: company?.street_extra,
    },
    city: {
      value: company?.city,
    },
    country: {
      value: company?.country,
    },
    state: {
      value: company?.state,
    },
    zip: {
      value: company?.zip,
    },
    street2: {
      value: company?.street2,
    },
    street_extra2: {
      value: company?.street_extra2,
    },
    city2: {
      value: company?.city2,
    },
    country2: {
      value: company?.country2,
    },
    state2: {
      value: company?.state2,
    },
    zip2: {
      value: company?.zip2,
    },
    is_partner: {
      value: company?.is_partner > 0,
    },
    partner: {
      value: company?.partner_id,
    },
  };
}

const formState = initFormState();

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
    is_partner: formRepresentation.is_partner.value ? 1 : 0,
    partner_id: formRepresentation.partner.value || undefined,
  };
}

function NewCustomerContact() {
  const { trans } = useTranslation();
  const router = useRouter();

  const { call, performing } = useAxios(
    'post',
    CUSTOMERS_PATH.replace(':id', ''),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(formState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || performing) {
      return;
    }

    call({
      body: formRepresentationToBody(formRepresentation),
    }).then((response: AxiosResponse) => {
      router.push(CUSTOMERS_CONTACTS_EDIT.replace(':id', response.data.id));
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newContact')}
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
            <IconButton onClick={() => router.push(CUSTOMERS_CONTACTS)}>
              <ArrowBack />
            </IconButton>
            {trans('newContact')}
          </Typography>
          <Box>
            <Button size="small"
              type="submit"
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
          type="customer"
          formRepresentation={formRepresentation}
          disabled={performing}
          setValue={setValue}
        />
      </form>
    </DashboardLayout>
  );
}

export default NewCustomerContact;
