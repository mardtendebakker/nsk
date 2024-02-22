import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import useAxios from '../../../../../hooks/useAxios';
import { PAYMENTS_PATH, PAYMENTS_SUBSCRIPTION_PATH } from '../../../../../utils/axios';
import { PaymentListItem } from '../../../../../utils/axios/models/payment';
import pushURLParams from '../../../../../utils/pushURLParams';
import List from './list';
import { getQueryParam } from '../../../../../utils/location';
import useTranslation from '../../../../../hooks/useTranslation';
import useCart from '../../../../../hooks/useCart';

function refreshList({
  page,
  rowsPerPage = 10,
  router,
  call,
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.append('page', page.toString());
  }

  params.append('rowsPerPage', rowsPerPage.toString());

  call({
    params: {
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
    },
  }).then(() => pushURLParams({ params, router })).catch(() => {});
}

export default function Payments() {
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));
  const { clearCart } = useCart();
  const router = useRouter();
  const { trans } = useTranslation();

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: PaymentListItem[], count?: number }>(
    'get',
    PAYMENTS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callSubscribe, performing: performingSubscribe } = useAxios<undefined | { data?: PaymentListItem[], count?: number }>(
    'post',
    PAYMENTS_SUBSCRIPTION_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callUnsubscribe, performing: performingUnsubscribe } = useAxios<undefined | { data?: PaymentListItem[], count?: number }>(
    'delete',
    PAYMENTS_SUBSCRIPTION_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    if (parseInt(getQueryParam('clearCart', '10'), 10) === 1) {
      clearCart();
    }

    refreshList({
      page,
      rowsPerPage,
      router,
      call,
    });
  }, [page, rowsPerPage]);

  const handleSubscription = (payment: PaymentListItem, checked: boolean) => {
    let promise;

    if (checked) {
      promise = callSubscribe({ path: PAYMENTS_SUBSCRIPTION_PATH.replace(':id', payment.id.toString()) });
    } else {
      promise = callUnsubscribe({ path: PAYMENTS_SUBSCRIPTION_PATH.replace(':id', payment.id.toString()) });
    }

    promise.then(() => refreshList({
      page,
      rowsPerPage,
      router,
      call,
    }));
  };

  const disabled = performing || performingSubscribe || performingUnsubscribe;

  return (
    <>
      <Typography variant="h4" sx={{ mb: '1rem' }}>
        {trans('payments')}
      </Typography>
      <List
        count={count}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
        onSubscribe={handleSubscription}
        page={page}
        rowsPerPage={rowsPerPage}
        disabled={disabled}
        payments={data}
      />
    </>
  );
}
