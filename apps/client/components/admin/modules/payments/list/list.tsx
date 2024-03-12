import {
  Box,
  Collapse,
  Table, TableBody, TableHead, TablePagination, TableRow,
} from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import useTranslation from '../../../../../hooks/useTranslation';
import TableCell from '../../../../tableCell';
import { PaymentListItem } from '../../../../../utils/axios/models/payment';
import { price } from '../../../../../utils/formatter';
import Checkbox from '../../../../checkbox';
import Chip, { Variant } from '../../../../chip';
import ConfirmationDialog from '../../../../confirmationDialog';

export default function List({
  payments = [],
  disabled,
  count,
  onPageChange,
  page,
  rowsPerPage,
  onRowsPerPageChange,
  onSubscribe,
}: {
  payments: PaymentListItem[],
  disabled: boolean,
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  onRowsPerPageChange: (rowsPerPage: number)=>void,
  onSubscribe: (payment: PaymentListItem, checked: boolean)=>void,
  rowsPerPage: number,
}) {
  const { trans } = useTranslation();
  const [shownPaymentModules, setShownPaymentModules] = useState<number | undefined>();
  const [recurrentPaymentTarget, setRecurrentPaymentTarget] = useState<{ payment: PaymentListItem, checked: boolean } | undefined>();

  const handleClick = ({ id }) => {
    setShownPaymentModules(id == shownPaymentModules ? undefined : id);
  };

  return (
    <>
      <ConfirmationDialog
        open={!!recurrentPaymentTarget}
        title={<>{trans('recurrentPayment')}</>}
        content={<Box sx={{ width: '25rem' }}>{`${trans('recurrentPaymentConfirmation')}`}</Box>}
        onConfirm={() => {
          onSubscribe(recurrentPaymentTarget.payment, recurrentPaymentTarget.checked);
          setRecurrentPaymentTarget(undefined);
        }}
        onClose={() => setRecurrentPaymentTarget(undefined)}
      />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('method')}
            </TableCell>
            <TableCell>
              {trans('transactionId')}
            </TableCell>
            <TableCell>
              {trans('amount')}
            </TableCell>
            <TableCell>
              {trans('status')}
            </TableCell>
            <TableCell>
              {trans('createdAt')}
            </TableCell>
            <TableCell>
              {trans('updatedAt')}
            </TableCell>
            <TableCell>
              {trans('recurrentPayment')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment: PaymentListItem) => {
            let chipVariant: Variant = 'warning';

            if (payment.status === 'paid') {
              chipVariant = 'success';
            } else if (payment.status === 'refunded') {
              chipVariant = 'danger';
            }

            return (
              <>
                <TableRow
                  onClick={() => handleClick(payment)}
                  sx={{ height: 60, cursor: 'pointer' }}
                  hover
                  key={payment.id}
                >
                  <TableCell>
                    {payment.method}
                  </TableCell>
                  <TableCell>
                    {payment.transactionId}
                  </TableCell>
                  <TableCell>
                    {price(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <Chip variant={chipVariant}>{trans(payment.status)}</Chip>
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.createdAt), 'yyyy/MM/dd')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.updatedAt), 'yyyy/MM/dd')}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      disabled={disabled || payment.status !== 'paid'}
                      onCheck={(checked) => {
                        setRecurrentPaymentTarget({ payment, checked });
                      }}
                      checked={!!payment.subscriptionId}
                    />
                  </TableCell>
                </TableRow>
                {payment.modules.length > 0 && (
                <TableRow
                  sx={(theme) => ({ backgroundColor: theme.palette.grey[10] })}
                >
                  <TableCell colSpan={7} sx={{ padding: 0 }}>
                    <Collapse in={shownPaymentModules == payment.id} unmountOnExit mountOnEnter>
                      <Table sx={{ borderRadius: 0 }} size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{trans('name')}</TableCell>
                            <TableCell>{trans('price')}</TableCell>
                            <TableCell>{trans('activeAt')}</TableCell>
                            <TableCell>{trans('expiresAt')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {payment.modules.map((module) => (
                            <TableRow key={module.id} sx={{ height: 60 }}>
                              <TableCell sx={{ padding: '0 16px' }}>
                                {module.name}
                              </TableCell>
                              <TableCell sx={{ padding: '0 16px' }}>
                                {price(module.price)}
                              </TableCell>
                              <TableCell sx={{ padding: '0 16px' }}>
                                {format(new Date(module.activeAt), 'yyyy/MM/dd')}
                              </TableCell>
                              <TableCell sx={{ padding: '0 16px' }}>
                                {format(new Date(module.expiresAt), 'yyyy/MM/dd')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        size="small"
        component="div"
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        count={count}
        onPageChange={(_, newPage) => {
          if (!disabled) {
            onPageChange(newPage + 1);
          }
        }}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowsPerPageChange={(e) => {
          if (!disabled) {
            onRowsPerPageChange(parseInt(e.target.value, 10));
          }
        }}
      />
    </>
  );
}
