import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import Filter from './filter';
import useAxios from '../../../../hooks/useAxios';
import { ADMIN_USERS_PATH } from '../../../../utils/axios';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import pushURLParams from '../../../../utils/pushURLParams';
import { getQueryParam } from '../../../../utils/location';
import Edit from '../cognitoEdit';
import { CognitoUserListItem } from '../../../../utils/axios/models/user';

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
  pageToken,
  rowsPerPage = 10,
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();

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
      limit: rowsPerPage,
      pageToken,
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
  const [users, setUsers] = useState<CognitoUserListItem[]>([]);
  const [pagination, setPagination] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [editUsername, setEditUsername] = useState<string | undefined>();

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: getQueryParam('search'),
    createdAt: getQueryParam('createdAt'),
    createdBy: getQueryParam('createdBy'),
    lastActive: getQueryParam('lastActive'),
  }));

  const { data: { count = 0 } = {}, call, performing } = useAxios<undefined | { count?:number }>(
    'get',
    ADMIN_USERS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    refreshList({
      pageToken: undefined,
      rowsPerPage,
      formRepresentation,
      router,
      call,
    }).then(({ data: { data: userList, pageToken } }) => {
      setHasNextPage(!!pageToken);
      setPagination([undefined, pageToken]);
      setUsers(userList);
    });
  }, [
    rowsPerPage,
    formRepresentation.search.value,
    formRepresentation.createdAt.value,
    formRepresentation.createdBy.value,
    formRepresentation.lastActive.value,
  ]);

  const handleNextPageClicked = () => {
    refreshList({
      pageToken: pagination[pagination.length - 1],
      rowsPerPage,
      formRepresentation,
      router,
      call,
    }).then(({ data: { data: userList, pageToken } }) => {
      setHasNextPage(!!pageToken);
      if (pageToken) {
        setPagination([...pagination, pageToken]);
      }
      setUsers(userList);
    });
  };

  const handlePreviousPageClicked = () => {
    const paginationCopy = [...pagination];
    paginationCopy.splice(paginationCopy.length - 2);

    refreshList({
      pageToken: paginationCopy[paginationCopy.length - 1],
      rowsPerPage,
      formRepresentation,
      router,
      call,
    }).then(({ data: { data: userList, pageToken } }) => {
      setHasNextPage(!!pageToken);
      setPagination([...paginationCopy, pageToken]);
      setUsers(userList);
    });
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPagination([]);
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
        users={users}
        count={count}
        hasNextPage={hasNextPage}
        hasPreviousPage={pagination.length > 2}
        onGoNext={handleNextPageClicked}
        onGoPrevious={handlePreviousPageClicked}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        onEdit={setEditUsername}
      />
      {editUsername && <Edit username={editUsername} onClose={() => setEditUsername(undefined)} onConfirm={() => setEditUsername(undefined)} />}
    </Card>
  );
}
