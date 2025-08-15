import {
  Box,
} from '@mui/material';
import React from 'react';
import { trans } from 'itranslator';
import Select from '../input/select';

export default function DashboardFilters({
  year,
  month,
  toMonth,
  onYearChange,
  onMonthChange,
  onToMonthChange,
}: {
  year: string;
  month: string;
  toMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onToMonthChange: (toMonth: string) => void;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 10 },
    (_, i) => (currentYear - i).toString(),
  );
  const months = [
    { title: trans('january'), value: '01' },
    { title: trans('february'), value: '02' },
    { title: trans('march'), value: '03' },
    { title: trans('april'), value: '04' },
    { title: trans('may'), value: '05' },
    { title: trans('june'), value: '06' },
    { title: trans('july'), value: '07' },
    { title: trans('august'), value: '08' },
    { title: trans('september'), value: '09' },
    { title: trans('october'), value: '10' },
    { title: trans('november'), value: '11' },
    { title: trans('december'), value: '12' },
  ];

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onYearChange(event.target.value);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onMonthChange(event.target.value);
  };

  const handleToMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToMonthChange(event.target.value);
  };

  const yearOptions = years.map((y) => ({ title: y, value: y }));
  const monthOptions = [
    { title: 'All', value: '' },
    ...months,
  ];

  return (
    <Box sx={{
      display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap',
    }}
    >
      <Select
        sx={{ minWidth: 120 }}
        label={trans('year')}
        value={year}
        onChange={handleYearChange}
        options={yearOptions}
      />

      <Select
        sx={{ minWidth: 120 }}
        label={trans('month')}
        value={month}
        onChange={handleMonthChange}
        options={monthOptions}
        disabled={!year}
      />

      <Select
        sx={{ minWidth: 120 }}
        label={trans('toMonth')}
        value={toMonth}
        onChange={handleToMonthChange}
        options={monthOptions}
        disabled={!month}
      />
    </Box>
  );
}
