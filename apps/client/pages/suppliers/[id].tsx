import Head from 'next/head';
import {
  Box, Container, IconButton, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import { trans } from 'itranslator';
import Form from '../../components/suppliers/form';
import DashboardLayout from '../../layouts/dashboard';
import useAxios from '../../hooks/useAxios';
import { SUPPLIERS_PATH } from '../../utils/axios';
import { SUPPLIERS } from '../../utils/routes';
import useForm from '../../hooks/useForm';
import { dataInputsFormatter, formRepresentationToBody } from './new';

function UpdateSupplier() {
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
    'post',
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
        path: SUPPLIERS_PATH.replace(':id', ''),
      },
      (err) => {
        if (!err) {
          router.push(SUPPLIERS.replace(':id', ''));
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
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                mb: 2,
              }}
            >
              <Typography
                sx={{ m: 1 }}
                variant="h4"
              >
                <IconButton onClick={() => router.push(SUPPLIERS.replace(':id', ''))}>
                  <ArrowBack />
                </IconButton>
                {trans('editSupplier')}
              </Typography>
            </Box>
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
