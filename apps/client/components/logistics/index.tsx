import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Search from '@mui/icons-material/Search';
import {
  addDays, addMinutes, areIntervalsOverlapping, differenceInMinutes, format, setHours, setMinutes, setSeconds, startOfWeek,
} from 'date-fns';
import { NextRouter, useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import Event from './event';
import useAxios, { Call } from '../../hooks/useAxios';
import { CALENDAR_PICKUPS_PATH, CALENDAR_DELIVERIES_PATH } from '../../utils/axios';
import TextField from '../input/textField';
import { Logistic, LogisticServiceListItem } from '../../utils/axios/models/logistic';
import SideMap from './sideMap';
import Pagination from './pagination';
import LogisticsList from './logisticsList';
import pushURLParams from '../../utils/pushURLParams';
import { getQueryParam } from '../../utils/location';
import useRemoteConfig from '../../hooks/useRemoteConfig';

const TILE_HEIGHT = '3rem';

const refreshList = ({
  newDate,
  router,
  call,
}: {
  newDate: Date,
  router: NextRouter,
  call: Call,
}) => {
  const params = new URLSearchParams();
  params.append('date', newDate.toISOString());
  call({
    params: {
      startsAt: format(newDate, 'yyyy-MM-dd'),
      endsAt: format(addDays(newDate, 5), 'yyyy-MM-dd'),
    },
  }).then(() => pushURLParams({ params, router })).catch(() => {});
};

export default function Logistics({ type }: { type: 'pickup' | 'delivery' }) {
  const AJAX_PATH = type == 'pickup' ? CALENDAR_PICKUPS_PATH : CALENDAR_DELIVERIES_PATH;
  const { trans } = useTranslation();
  const router = useRouter();

  const { state: { config } } = useRemoteConfig();
  const [openHours, setOpenHours] = useState<string[]>([]);
  const [dates, setDates] = useState<Date[]>([]);

  function updateDates(firstDate: Date) {
    setDates(
      [
        new Date(firstDate),
        addDays(firstDate, 1),
        addDays(firstDate, 2),
        addDays(firstDate, 3),
        addDays(firstDate, 4),
        addDays(firstDate, 5),
        addDays(firstDate, 6),
      ].filter((date) => config?.logistics.days.includes(date.toLocaleDateString('en', { weekday: 'long' }).toLocaleLowerCase())),
    );
  }

  useEffect(() => {
    if (Number.isInteger(config?.logistics?.maxHour) && Number.isInteger(config?.logistics?.minHour)) {
      const hours = [];

      for (let i = config.logistics.minHour; i < config.logistics.maxHour; i++) {
        hours.push(`${i}:00`);
        hours.push(`${i}:30`);
      }

      setOpenHours(hours);

      updateDates(setHours(
        setMinutes(
          startOfWeek(
            new Date(getQueryParam('date', new Date().toISOString())),
            { weekStartsOn: 1 },
          ),
          0,
        ),
        config.logistics.minHour,
      ));
    }
  }, [JSON.stringify(config)]);

  const [selectedLogisticIds, setSelectedLogisticIds] = useState<number[]>([0]);
  const [search, setSearch] = useState('');
  const [clickedLogisticService, setClickedLogisticService] = useState<{
    logisticService: LogisticServiceListItem,
    allLogisticServices: LogisticServiceListItem[]
  } | undefined>();

  const { data: { data = [] } = {}, call } = useAxios<undefined | { data?: LogisticServiceListItem[] }>('get', AJAX_PATH.replace(':id', ''), { withProgressBar: true });

  const formattedDataWithDefaultLogistic = data.map(({ logistic, ...rest }): LogisticServiceListItem => ({
    ...rest,
    logistic: logistic || {
      id: 1, firstname: 'Anonymous', lastname: 'Driver', username: 'Unknown', email: 'Unknown',
    },
  }));

  useEffect(() => {
    if (!dates[0]) {
      return;
    }

    setSelectedLogisticIds([0]);
    refreshList({ newDate: dates[0], router, call });
  }, [dates[0]?.toISOString()]);

  const logistics: Logistic[] = [];

  formattedDataWithDefaultLogistic.forEach(({ logistic }) => {
    if (!logistics.find((element) => element.id == logistic.id)) {
      logistics.push(logistic);
    }
  });

  const handleLogisticClick = (logisticId: number) => {
    if (selectedLogisticIds.find((element) => element == logisticId)) {
      setSelectedLogisticIds((currentValue) => currentValue.filter((element) => element != logisticId));
    } else if (logisticId != 0) {
      setSelectedLogisticIds((currentValue) => [...currentValue.filter((element) => element != 0), logisticId]);
    } else {
      setSelectedLogisticIds([logisticId]);
    }
  };

  const formatLogisticServiceName = (logisticService: LogisticServiceListItem) => logisticService.event_title || trans(type);

  const logisticServices: LogisticServiceListItem[] = formattedDataWithDefaultLogistic.filter((logisticService: LogisticServiceListItem) => {
    const selected = selectedLogisticIds[0] === 0 || selectedLogisticIds.includes(logisticService.logistic.id);

    return selected && (formatLogisticServiceName(logisticService)?.includes(search) || logisticService.order.order_nr.includes(search));
  });

  const overlappingLogisticServices: LogisticServiceListItem[][] = [];

  const logisticServicesLength = logisticServices.length;

  for (let i = 0; i < logisticServicesLength; i++) {
    const overlappingLogisticServicesLength = overlappingLogisticServices.length;
    let pushedInGroup = false;
    for (let j = 0; j < overlappingLogisticServicesLength; j++) {
      const overlappingLogisticServicesGroup = overlappingLogisticServices[j];
      const overlappingLogisticServicesGroupLength = overlappingLogisticServicesGroup.length;
      for (let k = 0; k < overlappingLogisticServicesGroupLength; k++) {
        if (areIntervalsOverlapping(
          { start: setSeconds(new Date(overlappingLogisticServicesGroup[k].event_date), 0), end: addMinutes(setSeconds(new Date(overlappingLogisticServicesGroup[k].event_date), 0), 30) },
          { start: setSeconds(new Date(logisticServices[i].event_date), 0), end: addMinutes(setSeconds(new Date(logisticServices[i].event_date), 0), 30) },
          {
            inclusive: false,
          },
        )) {
          overlappingLogisticServicesGroup.push(logisticServices[i]);
          pushedInGroup = true;
          break;
        }
      }
    }

    if (!pushedInGroup) {
      overlappingLogisticServices.push([logisticServices[i]]);
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 0.15, pr: '5rem', maxWidth: '25rem' }}>
          <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>
            {type == 'pickup' ? trans('pickupsBy') : trans('deliveriesBy')}
            :
          </Typography>
          <LogisticsList onClick={handleLogisticClick} logistics={logistics} selectedLogisticIds={selectedLogisticIds} />
        </Box>
        <Card sx={{ flex: 0.85 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', px: 0 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', px: '1rem', py: '2rem', justifyContent: 'space-between',
            }}
            >
              {dates[0] && (
              <Pagination
                date={dates[0]}
                onPrevious={() => updateDates(addDays(dates[0], -7))}
                onNext={() => updateDates(addDays(dates[0], 7))}
              />
              )}
              <TextField
                InputProps={{
                  startAdornment: <Search sx={{ color: (theme) => theme.palette.grey[40] }} />,
                }}
                sx={{ width: '20rem' }}
                name="logistics-search"
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
                  <TableRow sx={{ height: '2.5rem' }}>
                    <TableCell sx={{ borderBottom: 'unset', width: '10rem' }} />
                    {dates.map((date: Date) => {
                      const formatted = format(date, 'EEEE d');
                      return <TableCell sx={{ borderLeft: (theme) => `1px solid ${theme.palette.divider}` }} key={formatted}>{formatted}</TableCell>;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ height: '3rem' }}>
                    <TableCell sx={{ verticalAlign: 'baseline', borderBottom: 'unset' }}>
                      <Box sx={{ marginTop: '-1.67em' }}>{openHours[0]}</Box>
                    </TableCell>
                    {dates.map((date: Date) => {
                      const thisDayLogisticServices: LogisticServiceListItem[][] = [];
                      const overlappingLogisticServicesLength = overlappingLogisticServices.length;
                      for (let i = 0; i < overlappingLogisticServicesLength; i++) {
                        thisDayLogisticServices.push(overlappingLogisticServices[i].filter(({ event_date }) => {
                          const realLogisticServiceDate = new Date(event_date);
                          return format(realLogisticServiceDate, 'Y-MM-dd') == format(date, 'Y-MM-dd');
                        }));
                      }

                      return (
                        <TableCell
                          key={date.toString()}
                          sx={{ position: 'relative', borderLeft: (theme) => `1px solid ${theme.palette.divider}` }}
                        >
                          {
                        thisDayLogisticServices.map((elements) => elements.map((logisticService, i) => {
                          const realLogisticServiceDate = new Date(logisticService.event_date);

                          return (
                            <Event
                              type={type}
                              onClick={() => {
                                setClickedLogisticService({
                                  logisticService,
                                  allLogisticServices: thisDayLogisticServices.flat().filter((element) => element.logistic && (element.logistic.id == logisticService.logistic.id)),

                                });
                              }}
                              logisticService={logisticService}
                              key={logisticService.id}
                              top={`${differenceInMinutes(realLogisticServiceDate, date) / 10}rem`}
                              height={TILE_HEIGHT}
                              left={`${(100 / elements.length) * i}%`}
                              width={`${(100 / elements.length)}%`}
                            />
                          );
                        }))
}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {openHours.map((hour, i) => {
                    if (i == 0) {
                      return undefined;
                    }

                    return (
                      <TableRow sx={{ height: TILE_HEIGHT }} key={hour}>
                        <TableCell sx={{ verticalAlign: 'baseline', borderBottom: 'unset' }}>
                          <Box sx={{ marginTop: '-1.67em' }}>{hour.includes(':00') && hour}</Box>
                        </TableCell>
                        {dates.map((date: Date) => (
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
      { clickedLogisticService && config?.logistics && (
      <SideMap
        type={type}
        logisticServices={clickedLogisticService.allLogisticServices}
        logisticService={clickedLogisticService.logisticService}
        onClose={() => setClickedLogisticService(undefined)}
        apiKey={config.logistics.apiKey}
      />
      )}
    </>
  );
}
