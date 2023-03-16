import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid,
  IconButton, Table, TableBody,
  TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useMemo } from 'react';
import ProductAvailabilityPicker from '../../../memoizedFormInput/productAvailabilityPicker';
import { Product } from '../../../../utils/axios';
import useTranslation from '../../../../hooks/useTranslation';
import useForm from '../../../../hooks/useForm';
import BorderedBox from '../../../borderedBox';
import TextField from '../../../memoizedFormInput/textField';
import ProductLocationPicker from '../../../memoizedFormInput/productLocationPicker';

function makeFormRepresentation(product: Product) {
  return {};
}

export default function Edit({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { trans } = useTranslation();
  const {
    formRepresentation,
    setValue,
  } = useForm(useMemo(makeFormRepresentation.bind(null, {}), []));

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <DialogTitle>
        <Box sx={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
          Edit Product
          <IconButton>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <form>
          <BorderedBox sx={{ width: '80rem', p: '1rem' }}>
            <Typography
              sx={{ mb: '2rem' }}
              variant="h4"
            >
              {trans('basicInfo')}
            </Typography>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <TextField
                  sx={{ flex: 0.33, mr: '1rem' }}
                  label={trans('sku')}
                  name="sku"
                  onChange={(e) => setValue({ field: 'sku', value: e.target.value })}
                />
                <TextField
                  sx={{ flex: 0.33, mr: '1rem' }}
                  label={trans('productName')}
                  name="name"
                  onChange={(e) => setValue({ field: 'name', value: e.target.value })}
                />
                <TextField
                  sx={{ flex: 0.33 }}
                  label={trans('productType')}
                  name="type"
                  onChange={(e) => setValue({ field: 'type', value: e.target.value })}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <ProductLocationPicker sx={{ flex: 0.33, mr: '1rem' }} placeholder="" />
                <ProductAvailabilityPicker sx={{ flex: 0.33, mr: '1rem' }} placeholder="" />
                <TextField
                  sx={{ flex: 0.33 }}
                  label={trans('price')}
                  name="price"
                  value="€"
                  onChange={(e) => setValue({ field: 'price', value: e.target.value })}
                />
              </Grid>
              <Grid
                item
                sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <TextField
                  fullWidth
                  size="medium"
                  multiline
                  maxRows={3}
                  label={trans('description')}
                  name="description"
                  onChange={(e) => setValue({ field: 'description', value: e.target.value })}
                />
              </Grid>
            </Grid>
          </BorderedBox>
          <BorderedBox sx={{ width: '80rem', p: '1rem', mt: '1.5rem' }}>
            <Typography
              sx={{ mb: '2rem' }}
              variant="h4"
            >
              {trans('productInfo')}
              <br />
              <b style={{ color: 'red' }}>Design needs to be discussed with shayan</b>
            </Typography>
          </BorderedBox>
        </form>
        <BorderedBox sx={{ width: '80rem', p: '1rem', mt: '1.5rem' }}>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('orders')}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {trans('orderNumber')}
                </TableCell>
                <TableCell>
                  {trans('orderDate')}
                </TableCell>
                <TableCell>
                  {trans('supplier/customer')}
                </TableCell>
                <TableCell>
                  {trans('status')}
                </TableCell>
                <TableCell>
                  {trans('actions')}
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
              </TableRow>
            </TableBody>
          </Table>
        </BorderedBox>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
        <Button onClick={onClose} variant="outlined" color="primary">{trans('print')}</Button>
        <Button onClick={onClose} variant="contained" color="primary">{trans('saveChanges')}</Button>
      </DialogActions>
    </Dialog>
  );
}
