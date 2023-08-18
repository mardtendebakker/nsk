import {
  Box,
  CardContent,
  Divider,
} from '@mui/material';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import BasicDetails from '../basicDetails';
import PricingDetails from '../pricingDetails';
import CustomerDetails from '../customerDetails';
import DeliveryDetails from '../deliveryDetails';

function SalesForm({
  formRepresentation,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
}) {
  return (
    <>
      <BasicDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex' }}>
        <Box sx={{ flex: 1 }}>
          <PricingDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
        <Box sx={{ m: '.5rem' }} />
        <Box sx={{ flex: 1 }}>
          <CustomerDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
      </CardContent>
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex' }}>
        <Box sx={{ flex: 0.5 }}>
          <DeliveryDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
        <Box sx={{ m: '.5rem' }} />
      </CardContent>
    </>
  );
}

export default SalesForm;
