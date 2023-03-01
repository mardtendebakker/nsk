import Head from 'next/head';
import {
  Box, Container, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import useTranslation from '../../hooks/useTranslation';
import Form from '../../components/customers/form';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { CUSTOMERS_PATH } from '../../utils/axios';
import { CUSTOMERS } from '../../utils/routes';
import useForm from '../../hooks/useForm';
import { dataInputsFormatter, formRepresentationToBody } from './new';

function UpdateCustomer() {
  const router = useRouter();
  const { trans } = useTranslation();

  const { id } = router.query;

  const {
    call: fetchCustomer,
    performing: performingFetchCustomer,
    data: customer = null,
  } = useAxios(
    'get',
    CUSTOMERS_PATH.replace(':id', id.toString()),
    { withProgressBar: true },
  );

  const { call, performing } = useAxios(
    'put',
    null,
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(
    useMemo(() => dataInputsFormatter(customer), [customer]),
  );

  useEffect(() => {
    if (id) {
      fetchCustomer()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(CUSTOMERS_PATH.replace(':id', 'new'));
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canSubmit = () => !performing && !performingFetchCustomer;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call(
      {
        body: formRepresentationToBody(formRepresentation),
        path: CUSTOMERS_PATH.replace(':id', id.toString()),
      },
      (err) => {
        if (!err) {
          router.push(CUSTOMERS.replace(':id', ''));
        }
      },
    );
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('editCustomer')}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
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
              <IconButton onClick={() => router.push(CUSTOMERS.replace(':id', ''))}>
                <ArrowBack />
              </IconButton>
              {trans('editCustomer')}
            </Typography>
          </Box>
          <Form
            formRepresentation={formRepresentation}
            disabled={!canSubmit()}
            onSubmit={handleSubmit}
            setValue={setValue}
          />
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default UpdateCustomer;
