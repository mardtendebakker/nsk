import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';
import { ADMIN_VEHICLES_PATH } from '../../../../../utils/axios';
import useAxios from '../../../../../hooks/useAxios';
import CreateModal from '../createModal';
import EditModal from '../editModal';
import debounce from '../../../../../utils/debounce';
import TextField from '../../../../memoizedInput/textField';
import { getQueryParam } from '../../../../../utils/location';
import { Vehicle } from '../../../../../utils/axios/models/logistic';
import useResponsive from '../../../../../hooks/useResponsive';
import refreshList from '../../../settings/refreshList';

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editVehicleId, setEditVehicleId] = useState<number | undefined>();
  const [search, setSearch] = useState(getQueryParam('search', ''));
  const isDesktop = useResponsive('up', 'md');

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: Vehicle[], count?: number }>(
    'get',
    ADMIN_VEHICLES_PATH.replace(':id', ''),
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
    callDelete({ path: ADMIN_VEHICLES_PATH.replace(':id', id.toString()) })
      .then(() => {
        handleSearchChange();
      })
      .catch(() => {});
  };

  return (
    <Box>
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', mb: '1rem', flexDirection: isDesktop ? undefined : 'column',
      }}
      >
        <Typography variant="h4">
          {trans('vehicles')}
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
            placeholder={trans('vehiclesList.search.placeholder')}
          />
          <Button
            size="small"
            disabled={disabled()}
            variant="contained"
            onClick={() => setShowForm(true)}
          >
            <Add />
            {trans('newVehicle')}
          </Button>
        </Box>
      </Box>
      <List
        vehicles={data}
        disabled={disabled()}
        onDelete={handleDelete}
        count={count}
        page={page}
        onEdit={(id) => setEditVehicleId(id)}
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
      {editVehicleId && (
      <EditModal
        onClose={() => setEditVehicleId(undefined)}
        onSubmit={() => {
          setEditVehicleId(undefined);
          refreshList({
            page, rowsPerPage, router, call, search,
          });
        }}
        id={editVehicleId.toString()}
      />
      )}
    </Box>
  );
}
