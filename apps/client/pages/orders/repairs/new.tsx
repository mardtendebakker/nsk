import Head from 'next/head';
import {
  Box, Button, IconButton, Typography, Card,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useMemo } from 'react';
import Form from '../../../components/orders/form/repair';
import DashboardLayout from '../../../layouts/dashboard';
import useAxios from '../../../hooks/useAxios';
import { AxiosResponse, REPAIR_ORDERS_PATH } from '../../../utils/axios';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { ORDERS_REPAIRS, ORDERS_REPAIRS_EDIT } from '../../../utils/routes';
import {
  formRepresentationToBody as salesFormRepresentationToBody,
  initFormState as salesInitFormState,
} from '../sales/new';
import { Order } from '../../../utils/axios/models/order';

export function initFormState(trans, order?: Order) {
  return {
    ...salesInitFormState(trans, order),
    orderStatus: { required: false },
    repairDamage: { value: order?.repair?.damage },
    repairDescription: { value: order?.repair?.description },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): object {
  return {
    ...salesFormRepresentationToBody(formRepresentation),
    orderStatus: undefined,
    repair: {
      damage: formRepresentation.repairDamage.value,
      description: formRepresentation.repairDescription.value,
    },
  };
}

function NewRepairOrder() {
  const { trans } = useTranslation();
  const router = useRouter();

  const { call, performing } = useAxios(
    'post',
    REPAIR_ORDERS_PATH.replace(':id', ''),
    { withProgressBar: true, showSuccessMessage: true },
  );

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans), []));

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (validate() || performing) {
      return;
    }

    call({
      body: formRepresentationToBody(formRepresentation),
    }).then((response: AxiosResponse) => {
      router.push(ORDERS_REPAIRS_EDIT.replace('[id]', response.data.id));
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>
          {trans('newRepair')}
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
            <IconButton onClick={() => router.push(ORDERS_REPAIRS)}>
              <ArrowBack />
            </IconButton>
            {trans('newRepair')}
          </Typography>
          <Box>
            <Button
              size="small"
              sx={{ ml: '1.5rem' }}
              color="inherit"
              variant="outlined"
              onClick={() => router.push(ORDERS_REPAIRS)}
            >
              {trans('cancel')}
            </Button>
            <Button
              size="small"
              sx={{ ml: '1.5rem' }}
              variant="contained"
              onClick={handleSubmit}
            >
              <Check />
              {trans('saveRepair')}
            </Button>
          </Box>
        </Box>
        <Card>
          <Form
            formRepresentation={formRepresentation}
            disabled={performing}
            setValue={setValue}
          />
        </Card>
      </form>
    </DashboardLayout>
  );
}

export default NewRepairOrder;
