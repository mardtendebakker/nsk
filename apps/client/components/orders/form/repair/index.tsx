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
import RepairDetails from '../repairDetails';
import useResponsive from '../../../../hooks/useResponsive';
import TotalPerProductType from '../totalPerProductType';

function RepairForm({
  formRepresentation,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
}) {
  const isDesktop = useResponsive('up', 'md');

  return (
    <>
      <BasicDetails type="repair" formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} disableOrderStatus />
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column' }}>
        <Box sx={{ flex: 1 }}>
          <PricingDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
        <Box sx={{ m: '.5rem' }} />
        <Box sx={{ flex: 1 }}>
          <CustomerDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
      </CardContent>
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column' }}>
        <Box sx={{ flex: 1 }}>
          <DeliveryDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
        <Box sx={{ m: '.5rem' }} />
        <Box sx={{ flex: 1 }}>
          <TotalPerProductType formRepresentation={formRepresentation} />
        </Box>
      </CardContent>
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex' }}>
        <Box sx={{ flex: isDesktop ? 0.5 : 1 }}>
          <RepairDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
      </CardContent>
    </>
  );
}

export default RepairForm;
