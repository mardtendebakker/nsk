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
import useResponsive from '../../../../hooks/useResponsive';
import TotalPerProductType from '../totalPerProductType';
import { AFile } from '../../../../utils/axios/models/aFile';

function SalesForm({
  formRepresentation,
  disabled,
  setValue,
  onFileDelete,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
  onFileDelete?: (file: AFile) => void,
}) {
  const isDesktop = useResponsive('up', 'md');

  return (
    <>
      <BasicDetails type="sales" formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
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
          <DeliveryDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} onFileDelete={onFileDelete} />
        </Box>
        <Box sx={{ m: '.5rem' }} />
        <Box sx={{ flex: 1 }}>
          <TotalPerProductType formRepresentation={formRepresentation} />
        </Box>
      </CardContent>
    </>
  );
}

export default SalesForm;
