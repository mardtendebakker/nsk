import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import { SyntheticEvent } from 'react';
import Add from '@mui/icons-material/Add';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../memoizedFormInput/textField';
import Autocomplete from '../../../memoizedFormInput/autocomplete';
import BaseTextField from '../../../textField';
import StatusPicker from './statusPicker';
import SupplierTypePicker from './supplierTypePicker';

function Form({
  formRepresentation,
  disabled,
  onSubmit,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  onSubmit: (e: SyntheticEvent) => void,
  setValue: SetValue
}) {
  const { trans } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('basicDetails')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1 }}
            >
              <TextField
                sx={{ flex: 0.33, mr: '1rem' }}
                label={trans('stockPoductForm.orderNr.label')}
                placeholder={trans('stockPoductForm.orderNr.placeholder')}
                name="orderNr"
              />
              <DesktopDatePicker
                onChange={() => {}}
                value={null}
                inputFormat="YYYY/MM/DD"
                label={trans('orderDate')}
                renderInput={(params) => (
                  <BaseTextField
                    sx={{ flex: 0.33, mr: '1rem' }}
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: trans('selectOrderDate'),
                    }}
                  />
                )}
              />
              <StatusPicker />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1 }}
            >
              <TextField
                fullWidth
                size="medium"
                multiline
                rows={3}
                label={trans('remarks')}
                placeholder={trans('remarks')}
                name="remarks"
                type="text"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ mx: '1.5rem' }} />
        <CardContent sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{ mb: '2rem' }}
              variant="h4"
            >
              {trans('pricingDetails')}
            </Typography>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
              >
                <TextField
                  sx={{ flex: 0.33, mr: '1rem' }}
                  label={trans('transportCost')}
                  placeholder="0.00"
                  type="number"
                  name="transportCost"
                />
                <TextField
                  sx={{ flex: 0.33, mr: '1rem' }}
                  label={trans('discount')}
                  placeholder="0.00"
                  type="number"
                  name="discount"
                />
                <Checkbox />
                {trans('isAGift')}
              </Grid>
              <Grid item>
                <Typography variant="h3">
                  {trans('total')}
                  : 0.00
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{ mb: '2rem' }}
              variant="h4"
            >
              {trans('supplierDetails')}
            </Typography>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
              >
                <SupplierTypePicker />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
              >
                <Autocomplete
                  fullWidth
                  disabled={disabled}
                  options={[]}
                  filterSelectedOptions
                  renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('supplier')}
                    placeholder={trans('selectSupplier')}
                  />
                )
               }
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider sx={{ mx: '1.5rem' }} />
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('addProducts')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {trans('ID')}
                    </TableCell>
                    <TableCell>
                      {trans('sku')}
                    </TableCell>
                    <TableCell>
                      {trans('productName')}
                    </TableCell>
                    <TableCell>
                      {trans('productType')}
                    </TableCell>
                    <TableCell>
                      {trans('retailUnitPrice')}
                    </TableCell>
                    <TableCell>
                      {trans('purchaseUnitPrice')}
                    </TableCell>
                    <TableCell>
                      {trans('purchaseQuantity')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Button>
                        <Add />
                        {trans('addAnotherProduct')}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
}

export default Form;
