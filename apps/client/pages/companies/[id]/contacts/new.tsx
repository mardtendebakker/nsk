import Head from 'next/head';
import {
  Box, Button, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useMemo } from 'react';
import Form from '../../../../components/contacts/form';
import DashboardLayout from '../../../../layouts/dashboard';
import useAxios from '../../../../hooks/useAxios';
import {
  AxiosResponse, CONTACTS_PATH,
} from '../../../../utils/axios';
import { COMPANIES_EDIT, COMPANIES_CONTACTS_EDIT } from '../../../../utils/routes';
import useForm from '../../../../hooks/useForm';
import useTranslation from '../../../../hooks/useTranslation';
import { Contact } from '../../../../utils/axios/models/contact';
import { initFormState, formRepresentationToBody } from '../../../contacts/new';

function NewSupplierContact() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const formState = useMemo(() => initFormState(trans, { id: 999, company_id: id ? parseInt(id.toString(), 10) : undefined } as Contact), [id || '']);

  const { call, performing } = useAxios(
    'post',
    CONTACTS_PATH.replace(':id', ''),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(formState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || performing) {
      return;
    }

    call({
      path: CONTACTS_PATH.replace(':id', ''),
      body: formRepresentationToBody(formRepresentation),
    }).then((response: AxiosResponse) => {
      router.push(COMPANIES_CONTACTS_EDIT.replace('[contact_id]', response.data.id));
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
            <IconButton onClick={() => router.push(COMPANIES_EDIT.replace('[id]', id.toString()))}>
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
              {trans('save')}
            </Button>
          </Box>
        </Box>
        <Form
          formRepresentation={formRepresentation}
          disabled={performing}
          setValue={setValue}
        />
      </form>
    </DashboardLayout>
  );
}

export default NewSupplierContact;
