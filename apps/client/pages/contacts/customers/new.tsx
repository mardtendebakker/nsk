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
import { AxiosResponse, CUSTOMERS_PATH } from '../../../utils/axios';
import { CONTACTS_CUSTOMERS_EDIT, CONTACTS_CUSTOMERS } from '../../../utils/routes';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation, { Trans } from '../../../hooks/useTranslation';
import { Contact } from '../../../utils/axios/models/contact';
import { initFormState as baseInitFormState, formRepresentationToBody as baseFormRepresentationToBody } from '../suppliers/new';

export const initFormState = (trans: Trans, contact?: Contact) => ({
  ...baseInitFormState(trans, contact),
  is_partner: {
    value: contact?.is_partner > 0,
  },
});

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  const isPartner = formRepresentation.is_partner.value ? 1 : 0;

  return {
    ...baseFormRepresentationToBody(formRepresentation),
    is_partner: isPartner,
    partner_id: isPartner ? null : formRepresentation.partner.value,
  };
}

function NewCustomerContact() {
  const { trans } = useTranslation();
  const router = useRouter();
  const formState = useMemo(() => initFormState(trans), []);

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
      router.push(CONTACTS_CUSTOMERS_EDIT.replace('[id]', response.data.id));
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
            <IconButton onClick={() => router.push(CONTACTS_CUSTOMERS)}>
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
