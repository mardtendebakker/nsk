import Head from 'next/head';
import {
  Box, Button, Container, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import Form from '../../../components/customers/emails/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { Customer, CUSTOMERS_PATH } from '../../../utils/axios';
import { CUSTOMERS_EMAILS } from '../../../utils/routes';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';

export function dataInputsFormatter(customer?: Customer) {
  return {
  };
}

const initFormState = dataInputsFormatter();

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
  };
}

function NewCustomerEmail() {
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
          router.push(CUSTOMERS_EMAILS);
        }
      },
    );
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newEmail')}
        </title>
      </Head>
      <Box
        component="main"
        sx={{ py: 8 }}
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
              <IconButton onClick={() => router.push(CUSTOMERS_EMAILS)}>
                <ArrowBack />
              </IconButton>
              {trans('newEmail')}
            </Typography>
            <Box>
              <Button
                sx={{ ml: '1.5rem' }}
                variant="contained"
                onClick={handleSubmit}
              >
                <Check />
                {trans('saveEmail')}
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

export default NewCustomerEmail;
