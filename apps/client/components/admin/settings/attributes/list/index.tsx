import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';
import { ATTRIBUTES_PATH } from '../../../../../utils/axios';
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
  const [editAttributeId, setEditAttributeId] = useState<number | undefined>();
  const [search, setSearch] = useState(router.query?.search?.toString() || '');

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    ATTRIBUTES_PATH.replace(':id', ''),
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '2rem' }}>
        <Typography variant="h3">
          {trans('attributes')}
          {` (${count})`}
        </Typography>
        <Box>
          <TextField
            sx={{ mr: '1rem' }}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearchChange(e.target.value);
            }}
            value={search}
            placeholder={trans('attributesList.search.placeholder')}
          />
          <Button
            disabled={disabled()}
            variant="contained"
            onClick={() => setShowForm(true)}
          >
            <Add />
            {trans('newAttribute')}
          </Button>
        </Box>
      </Box>
      <List
        attributes={data}
        disabled={disabled()}
        count={Math.ceil(count / 10)}
        page={page}
        onEdit={(id) => setEditAttributeId(id)}
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
      {editAttributeId && (
      <EditModal
        onClose={() => setEditAttributeId(undefined)}
        onSubmit={() => {
          setEditAttributeId(undefined);
          refreshList({
            page, router, call, search,
          });
        }}
        id={editAttributeId.toString()}
      />
      )}
    </Box>
  );
}
