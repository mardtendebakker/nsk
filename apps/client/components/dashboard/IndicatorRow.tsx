import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import { trans } from 'itranslator';
import { count, price } from '../../utils/formatter';
import useAxios from '../../hooks/useAxios';
import { DashboardTotal } from '../../utils/axios/models/dashboard';
import { DASHBOARD_TOTAL } from '../../utils/axios/paths';
import useResponsive from '../../hooks/useResponsive';
import DashboardFilters from './DashboardFilters';

function Indicator({ title, value }: { title: string, value: number | string }) {
  return (
    <Box sx={{ m: '.5rem' }}>
      <Typography variant="inherit" color="text.secondary">{title}</Typography>
      <Typography variant="h3">{value}</Typography>
    </Box>
  );
}

export default function IndicatorRow() {
  const currentYear = useMemo(() => new Date().getFullYear().toString(), []);
  const [year, setYear] = useState<string>(currentYear);
  const [month, setMonth] = useState<string>('');
  const [toMonth, setToMonth] = useState<string>('');
  const { call, data = {} } = useAxios<DashboardTotal | undefined>('get', DASHBOARD_TOTAL);
  const isDesktop = useResponsive('up', 'md');

  useEffect(() => {
    const params: { year: string; month?: string; toMonth?: string } = {
      year,
    };
    if (month) params.month = month;
    if (toMonth) params.toMonth = toMonth;

    call({ params }).catch(() => {});
  }, [year, month, toMonth]);

  const handleYearChange = useCallback((newYear: string) => {
    setYear(newYear);
  }, []);

  const handleMonthChange = useCallback((newMonth: string) => {
    setMonth(newMonth);
    if (!newMonth) {
      setToMonth('');
    }
  }, []);

  const handleToMonthChange = useCallback((newToMonth: string) => {
    setToMonth(newToMonth);
  }, []);

  return (
    <Card>
      <CardContent>
        <DashboardFilters
          year={year}
          month={month}
          toMonth={toMonth}
          onYearChange={handleYearChange}
          onMonthChange={handleMonthChange}
          onToMonthChange={handleToMonthChange}
        />
      </CardContent>
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
