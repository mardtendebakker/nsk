import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import Form from '../../../components/contacts/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { AxiosResponse, SUPPLIERS_PATH } from '../../../utils/axios';
import { CONTACTS_SUPPLIERS_EDIT, CONTACTS_SUPPLIERS } from '../../../utils/routes';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from '../customers/new';

const formState = initFormState();

function NewSupplierContact() {
  const { trans } = useTranslation();
  const router = useRouter();

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
      router.push(CONTACTS_SUPPLIERS_EDIT.replace(':id', response.data.id));
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
