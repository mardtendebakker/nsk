import {
  CardContent,
  Divider,
  Box,
} from '@mui/material';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import BasicDetails from '../basicDetails';
import PricingDetails from '../pricingDetails';
import SupplierDetails from '../supplierDetails';
import { AFile } from '../../../../utils/axios/models/aFile';
import useResponsive from '../../../../hooks/useResponsive';
import { Order } from '../../../../utils/axios/models/order';
import ShippingDetails from '../shippingDetails';
import TotalPerProductType from '../totalPerProductType';

function PurchaseForm({
  formRepresentation,
  disabled,
  setValue,
  onFileDelete,
  order,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
  onFileDelete?: (file: AFile) => void,
  order?: Order
}) {
  const isDesktop = useResponsive('up', 'md');

  return (
    <>
      <BasicDetails type="purchase" formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column' }}>
        <Box sx={{ flex: 1 }}>
          <PricingDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
        <Box sx={{ m: '.5rem' }} />
        <Box sx={{ flex: 1 }}>
          <SupplierDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        </Box>
      </CardContent>
      {
      order && (
      <>
        <Divider sx={{ mx: '1.5rem' }} />
        <CardContent sx={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column' }}>
          <Box sx={{ flex: 1 }}>
            <ShippingDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} order={order} onFileDelete={onFileDelete} />
          </Box>
          <Box sx={{ m: '.5rem' }} />
          <Box sx={{ flex: 1 }}>
            <TotalPerProductType formRepresentation={formRepresentation} />
          </Box>
        </CardContent>
      </>
      )
}
    </>
  );
}

export default PurchaseForm;
