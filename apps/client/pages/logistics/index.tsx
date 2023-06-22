import {
  Box, Card, CardContent, IconButton, MenuItem, MenuList, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import Head from 'next/head';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Search from '@mui/icons-material/Search';
import DashboardLayout from '../../layouts/dashboard';
import useTranslation from '../../hooks/useTranslation';
import Event from '../../components/logistics/event';
import useAxios from '../../hooks/useAxios';
import { PICKUPS_PATH } from '../../utils/axios';
import TextField from '../../components/input/textField';
import { Logistic, Order, PickupListItem } from '../../utils/axios/models/pickup';

const hours = [];

for (let i = 0; i < 12; i++) {
  hours.push(`${7 + i}:00`);
  hours.push(`${7 + i}:30`);
}

export default function Logistics() {
  const { trans, locale } = useTranslation();
  const [firstDate, setFirstDate] = useState<Moment>(moment().set('hour', 7).set('minute', 0));
  const [selectedLogisticIds, setSelectedLogisticIds] = useState<number[]>([0]);
  const [search, setSearch] = useState('');

  const dates: Moment[] = [
    firstDate.clone(),
    firstDate.clone().add(1, 'days'),
    firstDate.clone().add(2, 'days'),
    firstDate.clone().add(3, 'days'),
    firstDate.clone().add(4, 'days'),
    firstDate.clone().add(5, 'days'),
    firstDate.clone().add(6, 'days'),
  ];

  const { data: { data = [] } = {}, call } = useAxios('get', PICKUPS_PATH.replace(':id', ''), { withProgressBar: true });

  useEffect(() => {
    setSelectedLogisticIds([0]);
    call({ params: { startsAt: firstDate.format('Y-MM-DD'), endsAt: dates[6].format('Y-MM-DD') } });
  }, [firstDate]);

  useEffect(() => {
    setFirstDate(firstDate.clone());
  }, [locale]);

  const logistics: Logistic[] = [];

  data.forEach(({ logistic }) => {
    if (!logistic) {
      return;
    }

    if (!logistics.find((element) => element.id == logistic.id)) {
      logistics.push(logistic);
    }
  });

  const handleLogisticMenuClick = (logisticId: number) => {
    if (selectedLogisticIds.find((element) => element == logisticId)) {
      setSelectedLogisticIds((currentValue) => currentValue.filter((element) => element != logisticId));
    } else if (logisticId != 0) {
      setSelectedLogisticIds((currentValue) => [...currentValue.filter((element) => element != 0), logisticId]);
    } else {
      setSelectedLogisticIds([logisticId]);
    }
  };

  const formatPickupName = (order: Order) => order?.products[0]?.name || trans('pickup');

  const pickups: PickupListItem[] = data.filter(({ logistic, order }) => {
    const selected = selectedLogisticIds[0] === 0 || selectedLogisticIds.includes(logistic?.id);

    return selected && (formatPickupName(order)?.includes(search) || order.order_nr.includes(search));
  });

  return (
    <DashboardLayout>
      <Head>
        <title>{trans('logistics')}</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 0.15, pr: '5rem', maxWidth: '25rem' }}>
          <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>
            {trans('pickupsBy')}
            :
          </Typography>
          <MenuList>
            <MenuItem
              onClick={() => handleLogisticMenuClick(0)}
              sx={(theme) => ({
                borderRadius: '.25rem',
                fontWeight: theme.typography.fontWeightMedium,
                background: selectedLogisticIds[0] === 0 ? '#D6E0FA' : undefined,
                color: selectedLogisticIds[0] === 0 ? theme.palette.primary.main : undefined,
                mb: '1rem',
                py: '1rem',
              })}
            >
              {trans('everyone')}
            </MenuItem>
            {logistics.map((logistic: Logistic) => {
              const active = !!selectedLogisticIds.find((element) => element == logistic.id);
              return (
                <MenuItem
                  onClick={() => handleLogisticMenuClick(logistic.id)}
                  key={logistic.id}
                  sx={(theme) => ({
                    borderRadius: '.25rem',
                    fontWeight: theme.typography.fontWeightMedium,
                    background: active ? '#D6E0FA' : undefined,
                    color: active ? theme.palette.primary.main : undefined,
                    whiteSpace: 'normal',
                    overflowWrap: 'anywhere',
                    mb: '1rem',
                    py: '1rem',
                  })}
                >
                  {logistic.username}
                </MenuItem>
              );
            })}
          </MenuList>
        </Box>
        <Card sx={{ flex: 0.85 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', px: 0 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', px: '1rem', py: '2rem', justifyContent: 'space-between',
            }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  sx={{ borderRadius: 0, border: '1px solid', mr: '1rem' }}
                  onClick={() => {
                    setFirstDate(firstDate.clone().add(-5, 'days'));
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h3">
                  {firstDate.format('DD MMMM Y')}
                </Typography>
                <IconButton
                  sx={{ borderRadius: 0, border: '1px solid', ml: '1rem' }}
                  onClick={() => {
                    setFirstDate(firstDate.clone().add(5, 'days'));
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
              <TextField
                InputProps={{
                  startAdornment: <Search sx={{ color: (theme) => theme.palette.grey[40] }} />,
                }}
                sx={{ width: '30rem' }}
                placeholder={trans('logisticsPage.search.placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Table sx={{
                borderLeft: 'unset', borderRight: 'unset', borderBottom: 'unset', borderRadius: 0,
              }}
              >
                <TableHead>
                  <TableRow sx={{ height: '5rem' }}>
                    <TableCell sx={{ borderBottom: 'unset', width: '10rem' }} />
                    {dates.map((date: Moment) => {
                      const formatted = date.format('dddd D');
                      return <TableCell sx={{ borderLeft: (theme) => `1px solid ${theme.palette.divider}`, width: '13.2%' }} key={formatted}>{formatted}</TableCell>;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ height: '6rem' }}>
                    <TableCell sx={{ verticalAlign: 'baseline', borderBottom: 'unset' }}>
                      <Box sx={{ marginTop: '-1.67em' }}>{hours[0]}</Box>
                    </TableCell>
                    {dates.map((date: Moment) => (
                      <TableCell
                        key={date.toString()}
                        sx={{ position: 'relative', borderLeft: (theme) => `1px solid ${theme.palette.divider}` }}
                      >
                        { pickups
                          .filter(({ real_pickup_date }) => {
                            const realPickupDate = moment(real_pickup_date);
                            return realPickupDate.format('Y-MM-DD') == date.format('Y-MM-DD');
                          })
                          .map(({
                            id, real_pickup_date, order, logistic,
                          }) => {
                            const realPickupDate = moment(real_pickup_date);

                            return (
                              <Event
                                key={id}
                                top={`${realPickupDate.diff(date, 'minutes') * 0.2}rem`}
                                height="12rem"
                                color={order.order_status.color}
                                title={`${realPickupDate.format('hh:mm')} - ${realPickupDate.add(1, 'hours').format('hh:mm')}`}
                                body={formatPickupName(order)}
                                username={logistic?.username || ''}
                              />
                            );
                          })}
                      </TableCell>
                    ))}
                  </TableRow>
                  {hours.map((hour, i) => {
                    if (i == 0) {
                      return undefined;
                    }

                    return (
                      <TableRow sx={{ height: '6rem' }} key={hour}>
                        <TableCell sx={{ verticalAlign: 'baseline', borderBottom: 'unset' }}>
                          <Box sx={{ marginTop: '-1.67em' }}>{hour.includes(':00') && hour}</Box>
                        </TableCell>
                        {dates.map((date: Moment) => (
                          <TableCell
                            key={date.toString()}
                            sx={{ position: 'relative', borderLeft: (theme) => `1px solid ${theme.palette.divider}` }}
                          />
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
