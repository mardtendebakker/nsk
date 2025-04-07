import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow,
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
import { Driver, LogisticServiceListItem, Vehicle } from '../../utils/axios/models/logistic';
import SideMap from './sideMap';
import Pagination from './pagination';
import pushURLParams from '../../utils/pushURLParams';
import { getQueryParam } from '../../utils/location';
import useRemoteConfig from '../../hooks/useRemoteConfig';
import Autocomplete from '../memoizedInput/autocomplete';

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

  const [selectedDriverIds, setSelectedDriverIds] = useState<number[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [clickedLogisticService, setClickedLogisticService] = useState<{
    logisticService: LogisticServiceListItem,
    allLogisticServices: LogisticServiceListItem[]
  } | undefined>();

  const { data: { data = [] } = {}, call } = useAxios<undefined | { data?: LogisticServiceListItem[] }>('get', AJAX_PATH.replace(':id', ''), { withProgressBar: true });

  const formattedDataWithDefaultLogistic = data.map(({ driver, ...rest }): LogisticServiceListItem => ({
    ...rest,
    driver: driver || {
      id: 0, first_name: 'Anonymous', last_name: 'Driver', username: 'Unknown', email: 'Unknown',
    },
  }));

  useEffect(() => {
    if (!dates[0]) {
      return;
    }

    setSelectedDriverIds([]);
    refreshList({ newDate: dates[0], router, call });
  }, [dates[0]?.toISOString()]);

  const drivers: Driver[] = [];
  const vehicles: Vehicle[] = [];

  formattedDataWithDefaultLogistic.forEach(({ driver, vehicle }) => {
    if (driver && !drivers.find((element) => element.id == driver.id)) {
      drivers.push(driver);
    }
    if (vehicle && !vehicles.find((element) => element.id == vehicle.id)) {
      vehicles.push(vehicle);
    }
  });

  const formatLogisticServiceName = (logisticService: LogisticServiceListItem) => logisticService.event_title || trans(type);

  const logisticServices: LogisticServiceListItem[] = formattedDataWithDefaultLogistic.filter((logisticService: LogisticServiceListItem) => {
    const selectedDriver = selectedDriverIds.length == 0 || selectedDriverIds.includes(logisticService.driver?.id);
    const selectedVehicle = selectedVehicleIds.length == 0 || selectedVehicleIds.includes(logisticService.vehicle?.id);

    return selectedDriver && selectedVehicle && (formatLogisticServiceName(logisticService)?.includes(search) || logisticService.order.order_nr.includes(search));
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
          <Autocomplete
            fullWidth
            size="small"
            multiple
            options={drivers.map(({ id, username }) => ({ id, label: username }))}
            filterSelectedOptions
            onChange={(_, selectedOptions: { id: number, label: string }[]) => {
              setSelectedDriverIds(selectedOptions.map(({ id }) => id));
            }}
            renderInput={
                          (params) => (
                            <TextField
                              {...params}
                              placeholder={type == 'pickup' ? trans('pickupsBy') : trans('deliveriesBy')}
                            />
                          )
                      }
          />
          <Autocomplete
            sx={{ mt: '.5rem' }}
            fullWidth
            size="small"
            multiple
            options={vehicles.map(({ id, registration_number }) => ({ id, label: registration_number }))}
            filterSelectedOptions
            onChange={(_, selectedOptions: { id: number, label: string }[]) => {
              setSelectedVehicleIds(selectedOptions.map(({ id }) => id));
            }}
            renderInput={
                          (params) => (
                            <TextField
                              {...params}
                              placeholder={trans('vehicle')}
                            />
                          )
                      }
          />
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
                                  allLogisticServices: thisDayLogisticServices.flat().filter((element) => {
                                    if (element.driver && element.vehicle) {
                                      return element.driver.id == logisticService.driver.id && element.vehicle.id == logisticService.vehicle.id;
                                    }

                                    return false;
                                  }),
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
