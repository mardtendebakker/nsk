import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton, Table, TableBody,
  TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { useMemo } from 'react';
import { Product } from '../../../utils/axios';
import useTranslation from '../../../hooks/useTranslation';
import useForm from '../../../hooks/useForm';
import BorderedBox from '../../borderedBox';
import ProductForm from '../productForm';

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
          {trans('editProduct')}
          <IconButton>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <ProductForm setValue={setValue} formRepresentation={formRepresentation} />
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
