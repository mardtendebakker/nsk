import Head from 'next/head';
import {
  Box, Button, Card, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useMemo } from 'react';
import Form from '../../components/companies/form';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { AxiosResponse, COMPANIES_PATH } from '../../utils/axios';
import { COMPANIES_EDIT, COMPANIES } from '../../utils/routes';
import useForm, { FormRepresentation } from '../../hooks/useForm';
import useTranslation from '../../hooks/useTranslation';
import { Company } from '../../utils/axios/models/company';

export function initFormState(company?: Company) {
  return {
    name: {
      value: company?.name,
      required: true,
    },
    kvk_nr: {
      value: company?.kvk_nr,
    },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
    name: formRepresentation.name.value || undefined,
    kvk_nr: formRepresentation.kvk_nr.value || undefined,
  };
}

function NewCompany() {
  const { trans } = useTranslation();
  const router = useRouter();
  const formState = useMemo(() => initFormState(), []);

  const { call, performing } = useAxios(
    'post',
    COMPANIES_PATH.replace(':id', ''),
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
      router.push(COMPANIES_EDIT.replace('[id]', response.data.id));
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newCompany')}
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
            <IconButton onClick={() => router.push(COMPANIES)}>
              <ArrowBack />
            </IconButton>
            {trans('newCompany')}
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
          <Form
            disabled={performing}
            formRepresentation={formRepresentation}
            setValue={setValue}
          />
        </Card>
      </form>
    </DashboardLayout>
  );
}

export default NewCompany;
