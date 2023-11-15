import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useMemo } from 'react';
import Form from '../../../components/contacts/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { AxiosResponse, SUPPLIERS_PATH } from '../../../utils/axios';
import { CONTACTS_SUPPLIERS_EDIT, CONTACTS_SUPPLIERS } from '../../../utils/routes';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation, { Trans } from '../../../hooks/useTranslation';
import { Contact } from '../../../utils/axios/models/contact';
import { isEmail } from '../../../utils/validator';

export function initFormState(trans: Trans, contact?: Contact) {
  return {
    name: {
      value: contact?.name,
      required: true,
    },
    representative: {
      value: contact?.representative,
    },
    kvk_nr: {
      value: contact?.kvk_nr,
    },
    email: {
      value: contact?.email,
      validator: (data: FormRepresentation) => (!isEmail(data.email.value?.toString()) ? trans('invalidEmail') : undefined),
    },
    phone: {
      value: contact?.phone,
    },
    phone2: {
      value: contact?.phone2,
    },
    street: {
      value: contact?.street,
    },
    street_extra: {
      value: contact?.street_extra,
    },
    city: {
      value: contact?.city,
    },
    country: {
      value: contact?.country,
    },
    state: {
      value: contact?.state,
    },
    zip: {
      value: contact?.zip,
    },
    street2: {
      value: contact?.street2,
    },
    street_extra2: {
      value: contact?.street_extra2,
    },
    city2: {
      value: contact?.city2,
    },
    country2: {
      value: contact?.country2,
    },
    state2: {
      value: contact?.state2,
    },
    zip2: {
      value: contact?.zip2,
    },

    partner: {
      value: contact?.partner_id,
    },
  };
}

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
    partner_id: formRepresentation.partner.value,
  };
}

function NewSupplierContact() {
  const { trans } = useTranslation();
  const router = useRouter();
  const formState = useMemo(() => initFormState(trans), []);

  const { call, performing } = useAxios(
    'post',
    SUPPLIERS_PATH.replace(':id', ''),
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
      router.push(CONTACTS_SUPPLIERS_EDIT.replace('[id]', response.data.id));
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
            <IconButton onClick={() => router.push(CONTACTS_SUPPLIERS)}>
              <ArrowBack />
            </IconButton>
            {trans('newContact')}
          </Typography>
          <Box>
            <Button
              size="small"
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
          type="supplier"
          formRepresentation={formRepresentation}
          disabled={performing}
          setValue={setValue}
        />
      </form>
    </DashboardLayout>
  );
}

export default NewSupplierContact;
