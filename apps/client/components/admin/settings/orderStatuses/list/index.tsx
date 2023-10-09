import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';
import { ORDER_STATUSES_PATH } from '../../../../../utils/axios';
import useAxios from '../../../../../hooks/useAxios';
import CreateModal from '../createModal';
import EditModal from '../editModal';
import refreshList from '../../refreshList';
import debounce from '../../../../../utils/debounce';
import TextField from '../../../../memoizedInput/textField';
import { getQueryParam } from '../../../../../utils/location';

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editOrderStatusId, setEditOrderStatusId] = useState<number | undefined>();
  const [search, setSearch] = useState(getQueryParam('search', ''));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    ORDER_STATUSES_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
    null,
    {
      withProgressBar: true,
      customStatusesMessages: {
        409: trans('deleteUsedOrderStatusMessage'),
      },
    },
  );

  useEffect(() => {
    refreshList({
      page, rowsPerPage, router, call, search,
    });
  }, [page, rowsPerPage]);

  const disabled = () => performing || performingDelete;

  const handleSearchChange = useCallback(debounce((value: string) => {
    setPage(1);
    refreshList({
      page: 1, rowsPerPage, router, call, search: value,
    });
  }), [rowsPerPage]);

  const handleDelete = (id: number) => {
    callDelete({ path: ORDER_STATUSES_PATH.replace(':id', id.toString()) })
      .then(() => {
        setPage(1);
      });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
        <Typography variant="h4">
          {trans('orderStatuses')}
          {` (${count})`}
        </Typography>
        <Box>
          <TextField
            sx={{ mr: '.5rem' }}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearchChange(e.target.value);
            }}
            defaultValue={search}
            placeholder={trans('orderStatusesList.search.placeholder')}
          />
          <Button
            size="small"
            disabled={disabled()}
            variant="contained"
            onClick={() => setShowForm(true)}
          >
            <Add />
            {trans('newOrderStatus')}
          </Button>
        </Box>
      </Box>
      <List
        orderStatuses={data}
        disabled={disabled()}
        count={count}
        page={page}
        onEdit={(id) => setEditOrderStatusId(id)}
        onDelete={handleDelete}
        onPageChange={(newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
        rowsPerPage={rowsPerPage}
      />
      {showForm && (
      <CreateModal
        onClose={() => setShowForm(false)}
        onSubmit={() => {
          setShowForm(false);
          refreshList({
            page, rowsPerPage, router, call, search,
          });
        }}
      />
      )}
      {editOrderStatusId && (
      <EditModal
        onClose={() => setEditOrderStatusId(undefined)}
        onSubmit={() => {
          setEditOrderStatusId(undefined);
          refreshList({
            page, rowsPerPage, router, call, search,
          });
        }}
        id={editOrderStatusId.toString()}
      />
      )}
    </Box>
  );
}
