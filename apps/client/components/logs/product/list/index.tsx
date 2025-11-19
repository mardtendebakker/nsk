import { Box, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from '../../../../hooks/useTranslation';
import { LOGS_PRODUCT_PATH } from '../../../../utils/axios';
import useAxios from '../../../../hooks/useAxios';
import debounce from '../../../../utils/debounce';
import TextField from '../../../memoizedInput/textField';
import { getQueryParam } from '../../../../utils/location';
import useResponsive from '../../../../hooks/useResponsive';
import refreshList from '../../../admin/settings/refreshList';
import { ProductLog } from '../../../../utils/axios/models/productLog';
import List from './list';

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));
  const [search, setSearch] = useState(getQueryParam('search', ''));
  const isDesktop = useResponsive('up', 'md');

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: ProductLog[], count?: number }>(
    'get',
    LOGS_PRODUCT_PATH.replace(':id', ''),
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
      <Box
        sx={{
          display: 'flex', justifyContent: 'space-between', mb: '1rem', flexDirection: isDesktop ? undefined : 'column',
        }}
      >
        <Typography variant="h4">
          {trans('productLogs')}
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
            placeholder={trans('search')}
          />
        </Box>
      </Box>
      <List
        productLogs={data}
        disabled={disabled()}
        count={count}
        page={page}
        onPageChange={(newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
        rowsPerPage={rowsPerPage}
      />
    </Box>
  );
}

