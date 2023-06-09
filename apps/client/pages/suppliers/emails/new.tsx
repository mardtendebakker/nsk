import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import Form from '../../../components/companies/emails/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { SUPPLIERS_PATH } from '../../../utils/axios';
import { SUPPLIERS_EMAILS } from '../../../utils/routes';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { Company } from '../../../utils/axios/models/company';

export function initFormState(company?: Company) {
  return {
  };
}

const formState = initFormState();

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
  };
}

function NewSupplierEmail() {
  const { trans } = useTranslation();
  const router = useRouter();

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
          router.push(SUPPLIERS_EMAILS);
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
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        <Typography variant="h4">
          <IconButton onClick={() => router.push(SUPPLIERS_EMAILS)}>
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
    </DashboardLayout>
  );
}

export default NewSupplierEmail;
