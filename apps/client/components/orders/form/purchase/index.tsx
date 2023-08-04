import {
  CardContent,
  Divider,
  Grid,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@mui/material';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import BaseTextField from '../../../input/textField';
import DataSourcePicker from '../../../memoizedInput/dataSourcePicker';
import { LOGISTICS_PATH } from '../../../../utils/axios';
import BasicDetails from '../basicDetails';
import PricingDetails from '../pricingDetails';
import { Order } from '../../../../utils/axios/models/order';
import SupplierDetails from './supplierDetails';
import { buildAFileLink } from '../../../../utils/afile';
import { AFile } from '../../../../utils/axios/models/aFile';

function PurchaseForm({
  formRepresentation,
  disabled,
  setValue,
  order,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
  order?: Order
}) {
  const { trans } = useTranslation();

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

  const pictures = picturesAFiles.map((afile: AFile) => {
    const file = buildAFileLink(afile);
    return (
      <Box
        onClick={() => window.open(file, '_blank')}
        sx={{
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
    );
  });

  return (
    <>
      <BasicDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
      <Divider sx={{ mx: '1.5rem' }} />
      <CardContent sx={{ display: 'flex' }}>
        <PricingDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
        <SupplierDetails formRepresentation={formRepresentation} disabled={disabled} setValue={setValue} />
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
            spacing={3}
            sx={{ flexDirection: 'column' }}
          >
            <Grid
              sx={{ display: 'flex', width: '50%' }}
              item
            >
              <DesktopDateTimePicker
                onChange={(value) => setValue({ field: 'pickupDate', value })}
                value={formRepresentation.pickupDate.value || null}
                inputFormat="yyyy/MM/dd H:ss"
                label={trans('pickupDate')}
                renderInput={(params) => (
                  <BaseTextField
                    sx={{ mr: '1rem' }}
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
              <DataSourcePicker
                fullWidth
                disabled={disabled}
                url={LOGISTICS_PATH.replace(':id', '')}
                label={trans('logistic')}
                placeholder={trans('selectLogistic')}
                onChange={(value: { id: number }) => {
                  setValue({ field: 'logisticId', value: value?.id });
                }}
                value={formRepresentation.logisticId.value}
                formatter={({ id, username, ...rest }: any) => ({
                  id, label: username, username, ...rest,
                })}
              />
            </Grid>
            <Grid
              sx={{ display: 'flex', width: '50%' }}
              item
            >
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>{trans('proposedPickupDate')}</TableCell>
                    <TableCell>{order?.pickup?.pickup_date || '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('description')}</TableCell>
                    <TableCell>{order?.pickup?.description || '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('origin')}</TableCell>
                    <TableCell>{order?.pickup?.origin || '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('dataDestruction')}</TableCell>
                    <TableCell>{DATA_DESTRUCTION[order?.pickup?.dataDestruction] || '--'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{trans('processingAgreement')}</TableCell>
                    <TableCell>
                      {
                      agreementAFile
                        ? (<a href={buildAFileLink(agreementAFile)} target="_blank" rel="noreferrer">{agreementAFile.original_client_filename}</a>)
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

PurchaseForm.defaultProps = { order: undefined };

export default PurchaseForm;
