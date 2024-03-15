import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { trans } from 'itranslator';
import { price } from '../../utils/formatter';
import useAxios from '../../hooks/useAxios';
import { DASHBOARD_TOTAL_COUNT } from '../../utils/routes';
import { TotalCount } from '../../utils/axios/models/dashboard';

function Indicator({ title, value }: { title: string, value: string }) {
  return (
    <Box sx={{ mx: '.5rem' }}>
      <Typography variant="inherit" color="text.secondary">{title}</Typography>
      <Typography variant="h3">{value}</Typography>
    </Box>
  );
}

export default function IndicatorRow() {
  const { call, data = {} } = useAxios<TotalCount | undefined>('get', DASHBOARD_TOTAL_COUNT);

  useEffect(() => {
    call().catch(() => {});
  }, []);

  return (
    <Card>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {
        [
          { title: 'Test Test 1', value: price(100) },
          { title: 'Test Test 2', value: price(100) },
          { title: trans('totalOrders'), value: String(data?.totalOrders) || '0' },
          { title: trans('totalSuppliers'), value: String(data?.totalSuppliers) || '0' },
          { title: trans('totalCustomers'), value: String(data?.totalCustomers) || '0' },
        ]
          .map(({ title, value }) => <Indicator key={title} title={title} value={value} />)
        }
      </CardContent>
    </Card>
  );
}
