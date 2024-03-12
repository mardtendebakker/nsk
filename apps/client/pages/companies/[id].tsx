import Head from 'next/head';
import {
  Box, Button, Card, CardContent, Divider, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import Form from '../../components/companies/form';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { COMPANIES_PATH } from '../../utils/axios';
import {
  COMPANIES_NEW, COMPANIES, COMPANIES_CONTACTS_NEW, COMPANIES_CONTACTS_EDIT,
} from '../../utils/routes';
import useForm from '../../hooks/useForm';
import useTranslation from '../../hooks/useTranslation';
import { initFormState, formRepresentationToBody } from './new';
import List from '../../components/contacts/list';
import Header from '../../components/contacts/header';
import { ContactListItem } from '../../utils/axios/models/contact';
import { Company } from '../../utils/axios/models/company';

function EditCompany() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const { call, performing } = useAxios(
    'put',
    COMPANIES_PATH.replace(':id', id?.toString()),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { call: callGet, performing: performingGet, data: company } = useAxios<undefined | Company>(
    'get',
    COMPANIES_PATH.replace(':id', id?.toString()),
    { withProgressBar: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(company), [company]));

  const canSubmit = () => !performing && !performingGet;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call({
      body: formRepresentationToBody(formRepresentation),
      path: COMPANIES_PATH.replace(':id', id?.toString()),
    });
  };

  useEffect(() => {
    if (id) {
      callGet()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(COMPANIES_NEW);
          }
        });
    }
  }, [id]);

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('editCompany')}
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
          <IconButton onClick={() => router.push(COMPANIES)}>
            <ArrowBack />
          </IconButton>
          {trans('editCompany')}
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
      <Card>
        <form onSubmit={handleSubmit}>
          <Form
            formRepresentation={formRepresentation}
            disabled={!canSubmit()}
            setValue={setValue}
          />
          {company && (
          <>
            <Divider sx={{ mx: '1.5rem' }} />
            <CardContent>
              <Header newContactRoute={COMPANIES_CONTACTS_NEW.replace('[id]', id.toString())} />
              <List
                company={company}
                editContactRouteBuilder={(contact: ContactListItem) => COMPANIES_CONTACTS_EDIT.replace('[id]', id.toString()).replace('[contact_id]', contact.id.toString())}
              />
            </CardContent>
          </>
          )}
        </form>
      </Card>
    </DashboardLayout>
  );
}

export default EditCompany;
