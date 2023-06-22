import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';
import { ORDER_STATUSES_PATH } from '../../../../../utils/axios';
import useAxios from '../../../../../hooks/useAxios';
import CreateModal from '../createModal';
import EditModal from '../editModal';

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editOrderStatusId, setEditOrderStatusId] = useState<number | undefined>();

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    ORDER_STATUSES_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    call({
      params: {
        take: 5,
        skip: (page - 1) * 5,
      },
    });
  }, [page]);

  const disabled = () => performing;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '2rem' }}>
        <Typography variant="h3">
          {trans('orderStatuses')}
          {` (${count})`}
        </Typography>
        <Button
          disabled={disabled()}
          variant="contained"
          onClick={() => setShowForm(true)}
        >
          <Add />
          {trans('newOrderStatus')}
        </Button>
      </Box>
      <List
        orderStatuses={data}
        disabled={disabled()}
        count={Math.ceil(count / 5)}
        page={page}
        onEdit={(id) => setEditOrderStatusId(id)}
        onPageChange={(newPage) => setPage(newPage)}
      />
      {showForm && <CreateModal onClose={() => setShowForm(false)} onSubmit={() => setShowForm(false)} />}
      {editOrderStatusId && (
      <EditModal
        onClose={() => setEditOrderStatusId(undefined)}
        onSubmit={() => setEditOrderStatusId(undefined)}
        id={editOrderStatusId.toString()}
      />
      )}
    </Box>
  );
}
