import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import Form from '../../../components/contacts/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { CUSTOMERS_PATH } from '../../../utils/axios';
import { CONTACTS_CUSTOMERS_NEW, CONTACTS_CUSTOMERS } from '../../../utils/routes';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from './new';

function EditCustomerContact() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id = '0' } = router.query;

  const { call, performing } = useAxios(
    'put',
    CUSTOMERS_PATH.replace(':id', id.toString()),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { call: callGet, performing: performingGet, data: customer } = useAxios(
    'get',
    CUSTOMERS_PATH.replace(':id', id.toString()),
    { withProgressBar: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(customer), [customer]));

  const canSubmit = () => !performing && !performingGet;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call({
      body: formRepresentationToBody(formRepresentation),
      path: CUSTOMERS_PATH.replace(':id', id.toString()),
    });
  };

  useEffect(() => {
    if (id) {
      callGet()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(CONTACTS_CUSTOMERS_NEW);
          }
        });
    }
  }, [id]);

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('editContact')}
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
            {trans('editContact')}
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
          disabled={!canSubmit()}
          setValue={setValue}
        />
      </form>
    </DashboardLayout>
  );
}

export default EditCustomerContact;
