import {
  CardContent,
  Divider,
  Grid,
  Typography,
  Table,
  TableRow,
  TableBody,
  Box,
} from '@mui/material';
import { useState } from 'react';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import BaseTextField from '../../../input/textField';
import DataSourcePicker from '../../../memoizedInput/dataSourcePicker';
import BasicDetails from '../basicDetails';
import PricingDetails from '../pricingDetails';
import { Order } from '../../../../utils/axios/models/order';
import SupplierDetails from '../supplierDetails';
import { buildAFileLink } from '../../../../utils/afile';
import { AFile } from '../../../../utils/axios/models/aFile';
import Delete from '../../../button/delete';
import useResponsive from '../../../../hooks/useResponsive';
import DateTimePicker from '../../../input/dateTimePicker';
import TableCell from '../../../tableCell';
import { AUTOCOMPLETE_DRIVERS_PATH, AUTOCOMPLETE_VEHICLES_PATH } from '../../../../utils/axios';

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
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');
  const [showPickupDateChangedMessage, setShowPickupDateChangedMessage] = useState(false);

  const DATA_DESTRUCTION = {
    0: trans('none'),
    1: trans('format'),
    2: trans('destructionStatement'),
    3: trans('shred'),
    4: trans('killDisk'),
  };

  let agreementAFile: AFile | undefined;
  const picturesAFiles: AFile[] = [];

  order?.pickup?.afile?.forEach((aFile: AFile) => {
    if (aFile.discr == 'pa') {
      agreementAFile = aFile;
    } else if (aFile.discr == 'pi') {
      picturesAFiles.push(aFile);
    }
  });

  const pictures = picturesAFiles.map((aFile: AFile) => {
    const file = buildAFileLink(aFile);
    return (
      <Box sx={{ position: 'relative' }} key={file}>
        <Box sx={{ right: '.5rem', top: 0, position: 'absolute' }}>
          { onFileDelete && <Delete tooltip onClick={() => onFileDelete(aFile)} disabled={disabled} />}
        </Box>
        <Box
          onClick={() => window.open(file, '_blank')}
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            mr: '.5rem',
            mb: '.5rem',
            borderRadius: '.5rem',
            width: '5rem',
            height: '5rem',
            cursor: 'pointer',
            backgroundImage: `url("${file}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </Box>
    );
  });

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
        <CardContent>
          <Typography
            sx={{ mb: '1rem' }}
            variant="h4"
          >
            {trans('pickupDetails')}
          </Typography>
          <Grid
            container
            spacing={1}
            sx={{ flexDirection: 'column' }}
          >
            <Grid
              sx={{ display: 'flex', width: isDesktop ? '50%' : 'unset', flexDirection: isDesktop ? undefined : 'column' }}
              item
            >
              <DateTimePicker
                disabled={disabled}
                onChange={(value) => {
                  setValue({ field: 'pickupDate', value });
                  setShowPickupDateChangedMessage(true);
                }}
                value={formRepresentation.pickupDate.value || null}
                label={trans('pickupDate')}
                renderInput={(params) => (
                  <BaseTextField
                    fullWidth
                    error={!!formRepresentation.pickupDate.error}
                    helperText={formRepresentation.pickupDate.error}
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: trans('selectPickupDate'),
                    }}
                  />
                )}
              />
              <Box sx={{ m: '.25rem' }} />
              <DataSourcePicker
                fullWidth
                disabled={disabled}
                path={AUTOCOMPLETE_VEHICLES_PATH}
                label={trans('vehicle')}
                placeholder={trans('selectVehicle')}
                onChange={(value: { id: number }) => {
                  setValue({ field: 'vehicleId', value: value?.id });
                }}
                value={formRepresentation.vehicleId.value}
                formatter={({ id, username, ...rest }: any) => ({
                  id, label: username, username, ...rest,
                })}
              />
              <Box sx={{ m: '.25rem' }} />
              <DataSourcePicker
                fullWidth
                disabled={disabled}
                path={AUTOCOMPLETE_DRIVERS_PATH}
                label={trans('driver')}
                placeholder={trans('selectDriver')}
                onChange={(value: { id: number }) => {
                  setValue({ field: 'driverId', value: value?.id });
                }}
                value={formRepresentation.driverId.value}
                formatter={({ id, username, ...rest }: any) => ({
                  id, label: username, username, ...rest,
                })}
              />
            </Grid>
            {showPickupDateChangedMessage && <Typography color="error" sx={{ m: '.5rem' }}>{trans('orderMightShouldChangeWarning')}</Typography>}
            <Grid
              sx={{ display: 'flex', width: isDesktop ? '50%' : 'unset' }}
              item
            >
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>{trans('proposedPickupDate')}</TableCell>
                    <TableCell>{order?.pickup?.pickup_date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('description')}</TableCell>
                    <TableCell>{order?.pickup?.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('origin')}</TableCell>
                    <TableCell>{order?.pickup?.origin}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('dataDestruction')}</TableCell>
                    <TableCell>{DATA_DESTRUCTION[order?.pickup?.data_destruction]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('processingAgreement')}</TableCell>
                    <TableCell>
                      {
                      agreementAFile
                        ? (
                          <>
                            <a href={buildAFileLink(agreementAFile)} target="_blank" rel="noreferrer" style={{ margin: '.5rem' }}>
                              {agreementAFile.original_client_filename}
                            </a>
                            {onFileDelete && <Delete tooltip onClick={() => onFileDelete(agreementAFile)} disabled={disabled} />}
                          </>
                        )
                        : '--'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('pictures')}</TableCell>
                    <TableCell sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {pictures.length > 0 ? pictures : '--'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </CardContent>
      </>
      )
}
    </>
  );
}

export default PurchaseForm;
