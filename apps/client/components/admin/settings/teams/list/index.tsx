import { Box, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';
import { TEAMS_PATH } from '../../../../../utils/axios';
import useAxios from '../../../../../hooks/useAxios';
import CreateModal from '../createModal';
import EditModal from '../editModal';
import refreshList from '../../refreshList';
import debounce from '../../../../../utils/debounce';
import TextField from '../../../../memoizedInput/textField';
import { getQueryParam } from '../../../../../utils/location';
import { Team } from '../../../../../utils/axios/models/order';
import NewResource from '../../../../button/newResource';
import useResponsive from '../../../../../hooks/useResponsive';

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editTeamId, setEditTeamId] = useState<number | undefined>();
  const [search, setSearch] = useState(getQueryParam('search', ''));
  const isDesktop = useResponsive('up', 'md');

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: Team[], count?: number }>(
    'get',
    TEAMS_PATH.replace(':id', ''),
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
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', mb: '1rem', flexDirection: isDesktop ? undefined : 'column',
      }}
      >
        <Typography variant="h4">
          {trans('teams')}
          {` (${count})`}
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <TextField
            sx={{ mr: '.5rem' }}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearchChange(e.target.value);
            }}
            defaultValue={search}
            placeholder={trans('teamsList.search.placeholder')}
          />
          <NewResource disabled={disabled()} label={trans('newTeam')} onClick={() => setShowForm(true)} />
        </Box>
      </Box>
      <List
        teams={data}
        disabled={disabled()}
        count={count}
        page={page}
        onEdit={(id) => setEditTeamId(id)}
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
      {editTeamId && (
      <EditModal
        onClose={() => setEditTeamId(undefined)}
        onSubmit={() => {
          setEditTeamId(undefined);
          refreshList({
            page, rowsPerPage, router, call, search,
          });
        }}
        id={editTeamId.toString()}
      />
      )}
    </Box>
  );
}
