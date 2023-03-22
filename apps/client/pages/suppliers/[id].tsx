import Head from 'next/head';
import {
  Box, Container, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import useTranslation from '../../hooks/useTranslation';
import Form from '../../components/suppliers/form';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { SUPPLIERS_PATH } from '../../utils/axios';
import { SUPPLIERS_NEW, SUPPLIERS } from '../../utils/routes';
import useForm from '../../hooks/useForm';
import { dataInputsFormatter, formRepresentationToBody } from './new';

function UpdateSupplier() {
  const { trans } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const {
    call: fetchSupplier,
    performing: performingFetchSupplier,
    data: supplier = null,
  } = useAxios(
    'get',
    SUPPLIERS_PATH.replace(':id', id.toString()),
    { withProgressBar: true },
  );

  const { call, performing } = useAxios(
    'put',
    null,
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(
    useMemo(() => dataInputsFormatter(supplier), [supplier]),
  );

  useEffect(() => {
    if (id) {
      fetchSupplier()
        .catch((error) => {
          if (error && error?.status !== 200) {
            router.push(SUPPLIERS_PATH.replace(':id', 'new'));
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canSubmit = () => !performing && !performingFetchSupplier;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (validate() || !canSubmit()) {
      return;
    }

    call(
      {
        body: formRepresentationToBody(formRepresentation),
        path: SUPPLIERS_PATH.replace(':id', id.toString()),
      },
      (err) => {
        if (!err) {
          router.push(SUPPLIERS_NEW);
        }
      },
    );
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('editSupplier')}
        </title>
      </Head>
      <Box
        component="main"
        sx={{ py: 8  }}
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
              <IconButton onClick={() => router.push(SUPPLIERS)}>
                <ArrowBack />
              </IconButton>
              {trans('editSupplier')}
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

export default UpdateSupplier;
