import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../hooks/useAxios';
import { COMPANIES_PATH } from '../../../utils/axios';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import pushURLParams from '../../../utils/pushURLParams';
import { getQueryParam } from '../../../utils/location';
import { CompanyListItem } from '../../../utils/axios/models/company';

function initFormState(
  {
    search, is_customer, is_supplier, is_partner,
  }:
  { search?: string, is_customer?: boolean, is_supplier?: boolean, is_partner?: boolean },

) {
  return {
    search: {
      value: search,
    },
    is_customer: {
      value: is_customer === true,
    },
    is_supplier: {
      value: is_supplier === true,
    },
    is_partner: {
      value: is_partner === true,
    },
  };
}

function refreshList({
  page,
  rowsPerPage = 10,
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.append('page', page.toString());
  }

  params.append('rowsPerPage', rowsPerPage.toString());

  const paramsToSend = {};

  ['search'].forEach((filter) => {
    if (formRepresentation[filter].value || formRepresentation[filter].value === 0) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
    }
  });

  ['is_customer', 'is_supplier', 'is_partner'].forEach((filter) => {
    if (formRepresentation[filter].value) {
      const value = formRepresentation[filter].value ? '1' : '0';
      params.append(filter, value);
      paramsToSend[filter] = value;
    }
  });

  call({
    params: {
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      ...paramsToSend,
    },
  }).then(() => pushURLParams({ params, router })).catch(() => {});
}

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: getQueryParam('search'),
    is_customer: getQueryParam('is_customer') === '1',
    is_partner: getQueryParam('is_partner') === '1',
    is_supplier: getQueryParam('is_supplier') === '1',
  }));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: CompanyListItem[], count?: number }>(
    'get',
    COMPANIES_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
    COMPANIES_PATH.replace(':id', ''),
    {
      withProgressBar: true,
      showSuccessMessage: true,
    },
  );

  useEffect(() => {
    refreshList({
      page,
      rowsPerPage,
      formRepresentation,
      router,
      call,
    });
  }, [
    page,
    rowsPerPage,
    formRepresentation.search.value,
    formRepresentation.is_customer.value,
    formRepresentation.is_supplier.value,
    formRepresentation.is_partner.value,
  ]);

  const handleReset = () => {
    setPage(1);
    setData(initFormState({}));
  };

  const handleDelete = (id: number) => {
    callDelete({ path: COMPANIES_PATH.replace(':id', id.toString()) })
      .then(() => {
        refreshList({
          page,
          rowsPerPage,
          formRepresentation,
          router,
          call,
        });
      });
  };

  const disabled = (): boolean => performing || performingDelete;

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
        onReset={handleReset}
        disabled={disabled()}
        formRepresentation={formRepresentation}
        setValue={(payload: FieldPayload) => {
          setValue(payload);
          setPage(1);
        }}
      />
      <Box sx={{ m: '1rem' }} />
      <List
        disabled={disabled()}
        companies={data}
        count={count}
        page={page}
        onDelete={handleDelete}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
        rowsPerPage={rowsPerPage}
      />
    </Card>
  );
}
