import {
  Box, Button, Card, CardContent, IconButton, MenuItem, Select, Typography,
} from '@mui/material';
import FileDownload from '@mui/icons-material/FileDownload';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import useAxios from '../../hooks/useAxios';
import useTranslation from '../../hooks/useTranslation';

export default function Analytics({ path, label }: { path: string, label: string }) {
  const { trans } = useTranslation();
  const { call, data = {} } = useAxios('get', '');
  const [groupby, setGroupby] = useState('months');

  const COLORS = {
    [trans('sale')]: '#1F0E8F',
    [trans('purchase')]: '#008A40',
    [trans('repair')]: '#AA4603',
  };

  useEffect(() => {
    call({ path, params: { groupby } });
  }, [path, groupby]);

  const values = Object.values(data);
  const keys = Object.keys(data).map((key) => trans(key));

  const max = Math.max(...values.map((value: []) => value.length));

  const chartData = [];

  for (let i = 0; i < max; i++) {
    const element = {
      name: null,
    };

    values.forEach((value: [{ day: number, month: number, year: number, count: number }], valueI) => {
      if (!element.name && value[i]) {
        element.name = value[i].day
          ? `${value[i].day}/${value[i].month}/${value[i].year}`
          : `${value[i].month}/${value[i].year}`;
      }

      element[keys[valueI]] = value[i]?.count || 0;
    });

    chartData.push(element);
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {label}
          </Typography>
          <Box>
            <Select size="small" value={groupby} onChange={(e) => setGroupby(e.target.value)}>
              <MenuItem value="months">{trans('months')}</MenuItem>
              <MenuItem value="days">{trans('days')}</MenuItem>
            </Select>
            <IconButton sx={(theme) => ({
              p: '.65rem',
              ml: '1rem',
              borderRadius: '.5rem',
              border: `1px solid ${theme.palette.divider}`,
            })}
            >
              <FileDownload />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mt: '2rem' }}>
          {keys.map((key) => (
            <Button variant="outlined" color="inherit" sx={{ mr: '1rem', cursor: 'unset' }} key={key} disableRipple>
              <Box sx={{
                mr: '.5rem',
                bgcolor: COLORS[key],
                width: '.5rem',
                height: '.5rem',
                borderRadius: '50%',
              }}
              />
              {key}
            </Button>
          ))}
        </Box>
        <Box sx={{ width: '100%', height: '30rem', p: '1rem' }}>
          <ResponsiveContainer width="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                bottom: 15,
                right: 15,
                left: 15,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" dx={10} dy={18} />
              <YAxis dx={-18} />
              <Tooltip />
              {keys.map((key) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[key]} activeDot={{ r: 10 }} strokeWidth={5} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
