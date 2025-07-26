import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { trans } from 'itranslator';
import { count, price } from '../../utils/formatter';
import useAxios from '../../hooks/useAxios';
import { DASHBOARD_TOTAL } from '../../utils/routes';
import { DashboardTotal } from '../../utils/axios/models/dashboard';
import useResponsive from '../../hooks/useResponsive';

function Indicator({ title, value }: { title: string, value: number | string }) {
  return (
    <Box sx={{ m: '.5rem' }}>
      <Typography variant="inherit" color="text.secondary">{title}</Typography>
      <Typography variant="h3">{value}</Typography>
    </Box>
  );
}

export default function IndicatorRow() {
  const { call, data = {} } = useAxios<DashboardTotal | undefined>('get', DASHBOARD_TOTAL);
  const isDesktop = useResponsive('up', 'md');

  useEffect(() => {
    call().catch(() => {});
  }, []);

  return (
    <Card>
      <CardContent sx={{
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: isDesktop ? undefined : 'column',
      }}
      >
        {
        [
          { title: trans('totalSpent'), value: price(data?.totalSpent) || '0' },
          { title: trans('totalEarned'), value: price(data?.totalEarned) || '0' },
          { title: trans('totalOrders'), value: count(data?.totalOrders) || '0' },
          { title: trans('totalSuppliers'), value: count(data?.totalSuppliers) || '0' },
          { title: trans('totalCustomers'), value: count(data?.totalCustomers) || '0' },
        ]
          .map(({ title, value }) => <Indicator key={title} title={title} value={value} />)
        }
      </CardContent>
    </Card>
  );
}
