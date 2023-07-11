import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import Form from '../../components/bulkEmail/form';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { CUSTOMERS_PATH } from '../../utils/axios';
import { BULK_EMAIL } from '../../utils/routes';
import useForm, { FormRepresentation } from '../../hooks/useForm';
import useTranslation from '../../hooks/useTranslation';
import { Company } from '../../utils/axios/models/company';

export function initFormState(customer?: Company) {
  return {
  };
}

const formState = initFormState();

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
  };
}

function NewBulkEmail() {
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
        path: CUSTOMERS_PATH.replace(':id', ''),
      },
      (err) => {
        if (!err) {
          router.push(BULK_EMAIL);
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
          <IconButton onClick={() => router.push(BULK_EMAIL)}>
            <ArrowBack />
          </IconButton>
          {trans('newEmail')}
        </Typography>
        <Box>
          <Button
            size="small"
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

export default NewBulkEmail;
