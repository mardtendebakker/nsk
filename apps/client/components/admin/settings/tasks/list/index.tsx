import {
  Box, Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';
import { TASKS_PATH } from '../../../../../utils/axios';
import useAxios from '../../../../../hooks/useAxios';
import CreateModal from '../createModal';
import EditModal from '../editModal';
import refreshList from '../../refreshList';
import debounce from '../../../../../utils/debounce';
import TextField from '../../../../memoizedInput/textField';
import { getQueryParam } from '../../../../../utils/location';
import { Task } from '../../../../../utils/axios/models/product';
import NewResource from '../../../../button/newResource';

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editTaskId, setEditTaskId] = useState<number | undefined>();
  const [search, setSearch] = useState(getQueryParam('search', ''));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: Task[], count?: number }>(
    'get',
    TASKS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    refreshList({
      page, rowsPerPage, router, call, search,
    });
  }, [page, rowsPerPage]);

  const disabled = () => performing;

  const handleSearchChange = useCallback(debounce((value: string) => {
    setPage(1);
    refreshList({
      page: 1, rowsPerPage, router, call, search: value,
    });
  }), [rowsPerPage]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
        <Typography variant="h4">
          {trans('tasks')}
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
            placeholder={trans('tasksList.search.placeholder')}
          />
          <NewResource disabled={disabled()} label={trans('newTask')} onClick={() => setShowForm(true)} requiredModule="tasks" />
        </Box>
      </Box>
      <List
        tasks={data}
        disabled={disabled()}
        count={count}
        page={page}
        onEdit={(id) => setEditTaskId(id)}
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
      {editTaskId && (
      <EditModal
        onClose={() => setEditTaskId(undefined)}
        onSubmit={() => {
          setEditTaskId(undefined);
          refreshList({
            page, rowsPerPage, router, call, search,
          });
        }}
        id={editTaskId.toString()}
      />
      )}
    </Box>
  );
}
