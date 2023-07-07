import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';
import { PRODUCT_STATUSES_PATH } from '../../../../../utils/axios';
import useAxios from '../../../../../hooks/useAxios';
import CreateModal from '../createModal';
import EditModal from '../editModal';
import refreshList from '../../refreshList';
import debounce from '../../../../../utils/debounce';
import TextField from '../../../../memoizedInput/textField';

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editProductStatusId, setEditProductStatusId] = useState<number | undefined>();
  const [search, setSearch] = useState(router.query?.search?.toString() || '');

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    PRODUCT_STATUSES_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    refreshList({
      page, router, call, search,
    });
  }, []);

  const disabled = () => performing;

  const handleSearchChange = useCallback(debounce((value: string) => {
    setPage(1);
    refreshList({
      page: 1, router, call, search: value,
    });
  }), []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
        <Typography variant="h4">
          {trans('productStatuses')}
          {` (${count})`}
        </Typography>
        <Box>
          <TextField
            sx={{ mr: '.5rem' }}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearchChange(e.target.value);
            }}
            value={search}
            placeholder={trans('productStatusesList.search.placeholder')}
          />
          <Button
            size="small"
            disabled={disabled()}
            variant="contained"
            onClick={() => setShowForm(true)}
          >
            <Add />
            {trans('newProductStatus')}
          </Button>
        </Box>
      </Box>
      <List
        productStatuses={data}
        disabled={disabled()}
        count={Math.ceil(count / 10)}
        page={page}
        onEdit={(id) => setEditProductStatusId(id)}
        onPageChange={(newPage: number) => {
          setPage(newPage);
          refreshList({
            page: newPage, router, call, search,
          });
        }}
      />
      {showForm && (
      <CreateModal
        onClose={() => setShowForm(false)}
        onSubmit={() => {
          setShowForm(false);
          refreshList({
            page, router, call, search,
          });
        }}
      />
      )}
      {editProductStatusId && (
      <EditModal
        onClose={() => setEditProductStatusId(undefined)}
        onSubmit={() => {
          setEditProductStatusId(undefined);
          refreshList({
            page, router, call, search,
          });
        }}
        id={editProductStatusId.toString()}
      />
      )}
    </Box>
  );
}
