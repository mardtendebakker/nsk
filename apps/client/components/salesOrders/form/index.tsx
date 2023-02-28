import {
  Box,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { SyntheticEvent } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import Details from './details';
import Pricing from './pricing';
import Customer from './customer';
import Products from './products';

function CustomerForm({
  isEdit = false,
  formRepresentation,
  disabled,
  onSubmit,
  setValue,
}: {
  isEdit : boolean,
  formRepresentation : FormRepresentation,
  disabled:boolean,
  onSubmit: (e: SyntheticEvent) => void,
  setValue: SetValue
}) {
  const { trans } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Card sx={{ flex: 1, maxHeight: 490 }}>
          <CardContent>
            <Details
              order_nr={formRepresentation.order_nr}
              order_date={formRepresentation.order_date}
              status={formRepresentation.status}
              remarks={formRepresentation.remarks}
              setValue={setValue}
            />
          </CardContent>
        </Card>
        <Box sx={{ mx: 1 }} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Card>
            <CardContent>
              <Pricing
                transport={formRepresentation.transport}
                discount={formRepresentation.discount}
                setValue={setValue}
              />
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Customer
                transport={formRepresentation.transport}
                discount={formRepresentation.discount}
                setValue={setValue}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
      { isEdit && (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Products />
        </CardContent>
      </Card>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
        }}
      >
        <Button
          type="submit"
          disabled={disabled}
          color="primary"
          variant="contained"
          onClick={onSubmit}
        >
          {trans('save')}
        </Button>
      </Box>
    </form>
  );
}

export default CustomerForm;
