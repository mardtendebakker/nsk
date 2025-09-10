import {
  Box, Grid, Typography,
  Table,
  TableRow,
  TableBody,
  Theme,
} from '@mui/material';
import { useState } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import BaseTextField from '../../input/textField';
import DateTimePicker from '../../input/dateTimePicker';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_DRIVERS_PATH, AUTOCOMPLETE_VEHICLES_PATH } from '../../../utils/axios';
import TableCell from '../../tableCell';
import { AFile } from '../../../utils/axios/models/aFile';
import { buildAFileLink } from '../../../utils/afile';
import Delete from '../../button/delete';
import ImageInput from '../../input/imageInput';
import useResponsive from '../../../hooks/useResponsive';
import { Order } from '../../../utils/axios/models/order';

export default function ShippingDetails({
  formRepresentation,
  disabled,
  onFileDelete,
  setValue,
  order,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  onFileDelete?: (file: AFile) => void,
  setValue: SetValue,
  order?: Order
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');
  const [showPickupDateChangedMessage, setShowPickupDateChangedMessage] = useState(false);

  const DATA_DESTRUCTION = {
    0: trans('none'),
    1: trans('format'),
    2: trans('statement'),
    3: trans('degauss'),
    4: trans('eraseData'),
  };

  const pictures = Object.entries(formRepresentation.picturesAFiles.value).map(([key, picture]: [string, File:AFile]) => (
    <ImageInput
      key={key}
      disabled={disabled}
      image={buildAFileLink(picture)}
      onClear={() => onFileDelete(picture)}
      sx={{ mr: '.5rem', border: (theme: Theme) => `1px dashed ${theme.palette.divider}`, mt: '1.5rem' }}
    />
  ));

  return (
    <>
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
                      formRepresentation.agreementAFile?.value
                        ? (
                          <>
                            <a href={buildAFileLink(formRepresentation.agreementAFile.value)} target="_blank" rel="noreferrer" style={{ margin: '.5rem' }}>
                              {formRepresentation.agreementAFile.value.original_client_filename}
                            </a>
                            {onFileDelete && <Delete tooltip onClick={() => onFileDelete(formRepresentation.agreementAFile.value)} disabled={disabled} />}
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
    </>
  );
}
