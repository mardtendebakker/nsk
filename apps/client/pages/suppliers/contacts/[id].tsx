import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import Form from '../../../components/companies/contacts/form';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { SUPPLIERS_PATH } from '../../../utils/axios';
import { SUPPLIERS_CONTACTS } from '../../../utils/routes';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { formRepresentationToBody, initFormState } from '../../customers/contacts/new';

function EditSupplierContact() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const { call, performing } = useAxios(
    'put',
    SUPPLIERS_PATH.replace(':id', id.toString()),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { call: callGet, performing: performingGet, data: supplier } = useAxios(
    'get',
    SUPPLIERS_PATH.replace(':id', id.toString()),
    { withProgressBar: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(supplier), [supplier]));

  const canSubmit = () => !performing && !performingGet;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call({
      body: formRepresentationToBody(formRepresentation),
      path: SUPPLIERS_PATH.replace(':id', id.toString()),
    });
  };

  useEffect(() => {
    if (id) {
      callGet()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(SUPPLIERS_CONTACTS.replace(':id', 'new'));
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
            <IconButton onClick={() => router.push(SUPPLIERS_CONTACTS)}>
              <ArrowBack />
            </IconButton>
            {trans('editContact')}
          </Typography>
          <Box>
            <Button
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
          disabled={!canSubmit()}
          setValue={setValue}
        />
      </form>
    </DashboardLayout>
  );
}

export default EditSupplierContact;