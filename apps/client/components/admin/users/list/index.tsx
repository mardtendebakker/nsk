import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../../hooks/useAxios';
import { USERS_PATH } from '../../../../utils/axios';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import pushURLParams from '../../../../utils/pushURLParams';
import { getQueryParam } from '../../../../utils/location';
import Edit from '../edit';
import { UserListItem } from '../../../../utils/axios/models/user';

function initFormState(
  {
    search, createdAt, createdBy, lastActive,
  }:
  { search?: string, createdAt?: string, createdBy?: string, lastActive?: string },
) {
  return {
    search: {
      value: search || '',
    },
    createdAt: {
      value: createdAt || null,
    },
    createdBy: {
      value: createdBy || undefined,
    },
    lastActive: {
      value: lastActive || undefined,
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

  ['search', 'createdAt', 'createdBy', 'lastActive'].forEach((filter) => {
    if (formRepresentation[filter].value || formRepresentation[filter].value === 0) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
    }
  });

  return call({
    params: {
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      ...paramsToSend,
    },
  })
    .then((result) => {
      pushURLParams({ params, router });
      return result;
    }).catch(() => {});
}

export default function ListContainer() {
  const router = useRouter();
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [editUser, setEditUser] = useState<undefined | UserListItem>();

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: getQueryParam('search'),
    createdAt: getQueryParam('createdAt'),
    createdBy: getQueryParam('createdBy'),
    lastActive: getQueryParam('lastActive'),
  }));

  const { data: { count = 0, data = [] } = {}, call, performing } = useAxios<undefined | { count?:number, data: UserListItem[] }>(
    'get',
    USERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
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
    rowsPerPage,
    formRepresentation.search.value,
    formRepresentation.createdAt.value,
    formRepresentation.createdBy.value,
    formRepresentation.lastActive.value,
  ]);

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
        onReset={() => { setData(initFormState({})); }}
        disabled={performing}
        formRepresentation={formRepresentation}
        setValue={(payload: FieldPayload) => setValue(payload)}
      />
      <Box sx={{ m: '1rem' }} />
      <List
        disabled={performing}
        users={data}
        count={count}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        onEdit={setEditUser}
        page={page}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
      />

      {!!editUser && (
      <Edit
        user={editUser}
        onClose={() => setEditUser(undefined)}
        onConfirm={
        () => {
          refreshList({
            page,
            rowsPerPage,
            formRepresentation,
            router,
            call,
          });
          setEditUser(undefined);
        }
      }
      />
      )}
    </Card>
  );
}
