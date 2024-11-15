import {
  useEffect, useMemo, useState,
} from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import OutputOutlinedIcon from '@mui/icons-material/OutputOutlined';
import Link from 'next/link';
import useTranslation from '../../../hooks/useTranslation';
import useForm from '../../../hooks/useForm';
import Form from '../form';
import { STOCK_PRODUCTS_PATH } from '../../../utils/axios';
import useAxios from '../../../hooks/useAxios';
import { formRepresentationToBody, initFormState } from '../createModal';
import ConfirmationDialog from '../../confirmationDialog';
import { ORDERS_PURCHASES_EDIT, ORDERS_REPAIRS_EDIT, ORDERS_SALES_EDIT } from '../../../utils/routes';
import { ProductType } from '../type';
import { Product } from '../../../utils/axios/models/product';
import useBulkPrintBarcodes from '../../../hooks/apiCalls/useBulkPrintBarcodes';

export default function EditModal(
  {
    onClose,
    onSubmit,
    id,
    type = 'product',
  }: {
    onClose: () => void,
    onSubmit: () => void,
    id: string,
    type?: ProductType,
  },
) {
  const { trans } = useTranslation();
  const { data: product, call, performing } = useAxios<undefined | Product>('get', STOCK_PRODUCTS_PATH.replace(':id', id));
  const { printBarcodes, performing: performingBulkPrintBarcodes } = useBulkPrintBarcodes({ withProgressBar: true });
  const { call: callPut, performing: performingPut } = useAxios('put', STOCK_PRODUCTS_PATH.replace(':id', id), { showSuccessMessage: true });

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(trans, product), [product]));
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const canSubmit = () => !performing && !performingPut && !performingBulkPrintBarcodes;

  const handleSave = () => {
    if (validate() && !canSubmit()) {
      return;
    }

    setShowConfirmation(false);

    callPut({
      body: formRepresentationToBody(formRepresentation),
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(onSubmit);
  };

  const editOrderUrl = (order) => {
    if (type === 'repair') {
      return ORDERS_REPAIRS_EDIT.replace('[id]', order.id.toString());
    }
    if (order.discr === 'p') {
      return ORDERS_PURCHASES_EDIT.replace('[id]', order.id.toString());
    }
    return ORDERS_SALES_EDIT.replace('[id]', order.id.toString());
  };

  const handleSubmit = (event?: React.SyntheticEvent) => {
    event?.preventDefault();
    if (!validate()) {
      setShowConfirmation(true);
    }
  };

  return (
    <>
      <ConfirmationDialog
        open
        title={<>{trans('editProduct')}</>}
        onClose={onClose}
        onConfirm={handleSubmit}
        disabled={!canSubmit()}
        content={(
          <>
            <form onSubmit={handleSubmit}>
              <Form
                setValue={setValue}
                formRepresentation={formRepresentation}
                disabled={!canSubmit()}
                onPrintBarcode={() => printBarcodes([parseInt(id, 10)])}
              />
              <input type="submit" style={{ display: 'none' }} />
            </form>
            <Table size="small" sx={{ mt: '.5rem' }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {trans('orderNumber')}
                  </TableCell>
                  <TableCell>
                    {trans('contact')}
                  </TableCell>
                  <TableCell>
                    {trans('orderDate')}
                  </TableCell>
                  <TableCell>
                    {trans('status')}
                  </TableCell>
                  <TableCell>
                    {trans('quantity')}
                  </TableCell>
                  <TableCell align="right">
                    {trans('actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(product as Product)?.product_orders?.map(({ quantity, order }) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order.discr == 'p' && (
                      <InputOutlinedIcon sx={{
                        color: (theme) => theme.palette.text.secondary,
                        mr: '1.5rem',
                        verticalAlign: 'middle',
                      }}
                      />
                      )}
                      {order.discr == 's' && (
                      <OutputOutlinedIcon
                        sx={{
                          color: (theme) => theme.palette.text.secondary,
                          mr: '1.5rem',
                          verticalAlign: 'middle',
                        }}
                      />
                      )}
                      {order.order_nr}
                    </TableCell>
                    <TableCell>
                      {`${order?.contact} - ${order?.company}`}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.order_date), 'yyyy/MM/dd')}
                    </TableCell>
                    <TableCell>
                      {order.status}
                    </TableCell>
                    <TableCell>
                      {quantity}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={trans('showOrder')}>
                        <Link href={editOrderUrl(order)} style={{ color: 'unset' }}>
                          <Visibility sx={{ color: (theme) => theme.palette.text.secondary }} />
                        </Link>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
      )}
      />
      <ConfirmationDialog
        open={showConfirmation}
        title={<>{trans('reminder')}</>}
        content={<span>{`${trans('productEditConfirmation', { vars: (new Map()).set('price', formRepresentation?.price.value) })}`}</span>}
        onConfirm={handleSave}
        onClose={() => setShowConfirmation(false)}
      />
    </>
  );
}
