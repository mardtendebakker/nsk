import { useEffect, useMemo } from 'react';
import {
  IconButton,
  Table, TableBody, TableCell, TableHead, TableRow, Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import { useRouter } from 'next/router';
import useTranslation from '../../../hooks/useTranslation';
import useForm from '../../../hooks/useForm';
import Form from '../form';
import { AxiosResponse, APRODUCT_BULK_PRINT_BARCODES, STOCK_PRODUCTS_PATH } from '../../../utils/axios';
import useAxios from '../../../hooks/useAxios';
import { formRepresentationToBody, initFormState } from '../createModal';
import ConfirmationDialog from '../../confirmationDialog';
import { openBlob } from '../../../utils/blob';
import { Product } from '../../../utils/axios/models/product';
import { ORDERS_PURCHASES_EDIT, ORDERS_SALES_EDIT } from '../../../utils/routes';

export default function EditModal(
  {
    onClose,
    onSubmit,
    id,
  }: {
    onClose: () => void,
    onSubmit: () => void,
    id: string,
  },
) {
  const { trans } = useTranslation();
  const router = useRouter();
  const { data: product, call, performing } = useAxios('get', STOCK_PRODUCTS_PATH.replace(':id', id));
  const { call: bulkPrint, performing: performingBulkPrintBarcodes } = useAxios('get', APRODUCT_BULK_PRINT_BARCODES);
  const { call: callPut, performing: performingPut } = useAxios('put', STOCK_PRODUCTS_PATH.replace(':id', id), { showSuccessMessage: true });

  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(product), [product]));

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const canSubmit = () => !performing && !performingPut && !performingBulkPrintBarcodes;

  const handleSave = () => {
    if (validate() && !canSubmit()) {
      return;
    }

    callPut({
      body: formRepresentationToBody(formRepresentation),
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(onSubmit);
  };

  const handlePrintBarcode = () => {
    bulkPrint({ params: { ids: [id] }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      });
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('editProduct')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={!canSubmit()}
      content={(
        <>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <Form
              setValue={setValue}
              formRepresentation={formRepresentation}
              disabled={!canSubmit()}
              onPrintBarcode={handlePrintBarcode}
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
                  {trans('company')}
                </TableCell>
                <TableCell>
                  {trans('orderDate')}
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
              {(product as Product)?.product_orders?.map(({ order }) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {order.order_nr}
                  </TableCell>
                  <TableCell>
                    {order.company}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.order_date), 'yyyy/MM/dd')}
                  </TableCell>
                  <TableCell>
                    {order.status}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={trans('showOrder')}>
                      <IconButton onClick={() => router.push(
                        (order.discr == 'p' ? ORDERS_PURCHASES_EDIT : ORDERS_SALES_EDIT).replace('[id]', order.id.toString()),
                      )}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    />
  );
}
