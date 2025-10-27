import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import Search from '@mui/icons-material/Search';
import {
  addMinutes, areIntervalsOverlapping, differenceInMinutes, format, setHours, setMinutes, setSeconds, eachDayOfInterval,
  getHours, isValid, startOfWeek, endOfWeek, addDays,
} from 'date-fns';
import { NextRouter, useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import Event from './event';
import useAxios, { Call } from '../../hooks/useAxios';
import { CALENDAR_PICKUPS_PATH, CALENDAR_DELIVERIES_PATH } from '../../utils/axios';
import TextField from '../input/textField';
import { Driver, LogisticServiceListItem, Vehicle } from '../../utils/axios/models/logistic';
import SideMap from './sideMap';
import pushURLParams from '../../utils/pushURLParams';
import { getQueryParam } from '../../utils/location';
import useRemoteConfig from '../../hooks/useRemoteConfig';
import Autocomplete from '../memoizedInput/autocomplete';
import { DateRangePicker } from '../input/dateRangePicker';

const TILE_HEIGHT = '3rem';

const refreshList = ({
  startDate,
  endDate,
  router,
  call,
}: {
  startDate: Date,
  endDate: Date,
  router: NextRouter,
  call: Call,
}) => {
  const params = new URLSearchParams();
  params.append('startDate', startDate.toISOString());
  params.append('endDate', endDate.toISOString());
  call({
    params: {
      startsAt: format(startDate, 'yyyy-MM-dd'),
      endsAt: format(addDays(endDate, 1), 'yyyy-MM-dd'),
    },
  }).then(() => pushURLParams({ params, router })).catch(() => {});
};

const getInitialStartDate = () => {
  const dateParam = getQueryParam('startDate', '');

  if (dateParam) {
    const date = new Date(dateParam);
    return isValid(date) ? date : undefined;
  }

  return startOfWeek(new Date(), { weekStartsOn: 1 });
};

const getInitialEndDate = () => {
  const dateParam = getQueryParam('endDate', '');

  if (dateParam) {
    const date = new Date(dateParam);
    return isValid(date) ? date : undefined;
  }

  return endOfWeek(new Date(), { weekStartsOn: 1 });
};

const generateTimeSlots = (minHour: number, maxHour: number) => {
  const hours = [];
  for (let i = minHour; i < maxHour; i++) {
    hours.push(`${i}:00`);
    hours.push(`${i}:30`);
  }
  return hours;
};

const extractDriversAndVehicles = (data: LogisticServiceListItem[]) => {
  const drivers: Driver[] = [];
  const vehicles: Vehicle[] = [];

  data.forEach(({ driver, vehicle }) => {
    if (driver && !drivers.find((element) => element.id === driver.id)) {
      drivers.push(driver);
    }
    if (vehicle && !vehicles.find((element) => element.id === vehicle.id)) {
      vehicles.push(vehicle);
    }
  });

  return { drivers, vehicles };
};

const filterLogisticServices = (
  data: LogisticServiceListItem[],
  selectedDriverIds: number[],
  selectedVehicleIds: number[],
  search: string,
  formatServiceName: (service: LogisticServiceListItem) => string,
) => data.filter((logisticService: LogisticServiceListItem) => {
  const { order } = logisticService;
  const selectedDriver = selectedDriverIds.length === 0 || selectedDriverIds.includes(logisticService.driver?.id);
  const selectedVehicle = selectedVehicleIds.length === 0 || selectedVehicleIds.includes(logisticService.vehicle?.id);
  const searchMatch = formatServiceName(logisticService)?.includes(search)
  || order.order_nr.includes(search)
  || order.customer?.zip?.includes(search)
  || order.customer?.city?.includes(search)
  || order.supplier?.zip?.includes(search)
  || order.supplier?.city?.includes(search);

  return selectedDriver && selectedVehicle && searchMatch;
});

const groupOverlappingServices = (services: LogisticServiceListItem[]) => {
  const overlappingGroups: LogisticServiceListItem[][] = [];

  for (let i = 0; i < services.length; i++) {
    let pushedInGroup = false;

    for (let j = 0; j < overlappingGroups.length; j++) {
      const group = overlappingGroups[j];

      for (let k = 0; k < group.length; k++) {
        const hasOverlap = areIntervalsOverlapping(
          {
            start: setSeconds(new Date(group[k].event_date), 0),
            end: addMinutes(setSeconds(new Date(group[k].event_date), 0), 30),
          },
          {
            start: setSeconds(new Date(services[i].event_date), 0),
            end: addMinutes(setSeconds(new Date(services[i].event_date), 0), 30),
          },
          { inclusive: false },
        );

        if (hasOverlap) {
          group.push(services[i]);
          pushedInGroup = true;
          break;
        }
      }

      if (pushedInGroup) break;
    }

    if (!pushedInGroup) {
      overlappingGroups.push([services[i]]);
    }
  }

  return overlappingGroups;
};

const getDayServices = (overlappingServices: LogisticServiceListItem[][], date: Date) => {
  const dayServices: LogisticServiceListItem[][] = [];

  for (let i = 0; i < overlappingServices.length; i++) {
    const filteredGroup = overlappingServices[i].filter(({ event_date }) => {
      const serviceDate = new Date(event_date);
      return format(serviceDate, 'Y-MM-dd') === format(date, 'Y-MM-dd');
    });
    dayServices.push(filteredGroup);
  }

  return dayServices;
};

const getRelatedServices = (dayServices: LogisticServiceListItem[][], targetService: LogisticServiceListItem) => dayServices.flat().filter((element) => {
  if (element.driver && element.vehicle) {
    return element.driver.id === targetService.driver.id && element.vehicle.id === targetService.vehicle.id;
  }
  return false;
});

export default function Logistics({ type }: { type: 'pickup' | 'delivery' }) {
  const AJAX_PATH = type === 'pickup' ? CALENDAR_PICKUPS_PATH : CALENDAR_DELIVERIES_PATH;
  const { trans } = useTranslation();
  const router = useRouter();
  const { state: { config } } = useRemoteConfig();

  const initStartDate = useMemo(() => getInitialStartDate(), []);
  const initEndDate = useMemo(() => getInitialEndDate(), []);

  const [openHours, setOpenHours] = useState<string[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(initStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initEndDate);
  const [selectedDriverIds, setSelectedDriverIds] = useState<number[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [clickedLogisticService, setClickedLogisticService] = useState<{
    logisticService: LogisticServiceListItem,
    allLogisticServices: LogisticServiceListItem[]
  } | undefined>();

  const { data: { data = [] } = {}, call } = useAxios<undefined | { data?: LogisticServiceListItem[] }>(
    'get',
    AJAX_PATH.replace(':id', ''),
    { withProgressBar: true },
  );

  const formattedDataWithDefaultLogistic = useMemo(() => data.map(({ driver, ...rest }): LogisticServiceListItem => ({
    ...rest,
    driver: driver || {
      id: 0,
      first_name: 'Anonymous',
      last_name: 'Driver',
      username: 'Unknown',
      email: 'Unknown',
    },
  })), [data]);

  const { drivers, vehicles } = useMemo(
    () => extractDriversAndVehicles(formattedDataWithDefaultLogistic),
    [formattedDataWithDefaultLogistic],
  );

  const formatLogisticServiceName = useCallback((logisticService: LogisticServiceListItem) => logisticService.event_title || trans(type), [trans, type]);

  const logisticServices = useMemo(() => filterLogisticServices(
    formattedDataWithDefaultLogistic,
    selectedDriverIds,
    selectedVehicleIds,
    search,
    formatLogisticServiceName,
  ), [formattedDataWithDefaultLogistic, selectedDriverIds, selectedVehicleIds, search, formatLogisticServiceName]);

  const overlappingLogisticServices = useMemo(
    () => groupOverlappingServices(logisticServices),
    [logisticServices],
  );

  useEffect(() => {
    if (Number.isInteger(config?.logistics?.maxHour) && Number.isInteger(config?.logistics?.minHour)) {
      let { minHour, maxHour } = config.logistics;

      if (data.length > 0) {
        const eventHours = data.map((item) => getHours(new Date(item.event_date)));
        minHour = Math.min(minHour, ...eventHours);
        maxHour = Math.max(maxHour, ...eventHours);
      }

      setOpenHours(generateTimeSlots(minHour, maxHour));
    }
  }, [config?.logistics?.maxHour, config?.logistics?.minHour, data]);

  useEffect(() => {
    if (startDate && endDate && openHours.length > 0) {
      const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
      const startHour = parseInt(openHours[0].split(':')[0], 10);
      const formattedDates = dateRange.map((date) => setHours(setMinutes(date, 0), startHour));
      setDates(formattedDates);
    } else {
      setDates([]);
    }
  }, [startDate, endDate, openHours]);

  useEffect(() => {
    if (!startDate || !endDate) {
      return;
    }

    setSelectedDriverIds([]);
    refreshList({
      startDate, endDate, router, call,
    });
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  const handleServiceClick = useCallback((logisticService: LogisticServiceListItem, dayServices: LogisticServiceListItem[][]) => {
    const relatedServices = getRelatedServices(dayServices, logisticService);
    setClickedLogisticService({
      logisticService,
      allLogisticServices: relatedServices,
    });
  }, []);

  const renderDriverAutocomplete = () => (
    <Autocomplete
      fullWidth
      size="small"
      multiple
      options={drivers.map(({ id, username }) => ({ id, label: username }))}
      filterSelectedOptions
      onChange={(_, selectedOptions: { id: number, label: string }[]) => {
        setSelectedDriverIds(selectedOptions.map(({ id }) => id));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={type === 'pickup' ? trans('pickupsBy') : trans('deliveriesBy')}
        />
      )}
    />
  );

  const renderVehicleAutocomplete = () => (
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
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={trans('vehicle')}
        />
      )}
    />
  );

  const renderTableHeader = () => (
    <TableHead>
      <TableRow sx={{ height: '2.5rem' }}>
        <TableCell sx={{ borderBottom: 'unset', width: '10rem' }} />
        {dates.map((date: Date) => {
          const formatted = format(date, 'MMMM - EEEE d');
          return (
            <TableCell
              sx={{
                borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                minWidth: '10rem',
              }}
              key={formatted}
            >
              {formatted}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );

  const renderFirstTableRow = () => (
    <TableRow sx={{ height: '3rem' }}>
      <TableCell sx={{ verticalAlign: 'baseline', borderBottom: 'unset' }}>
        <Box sx={{ marginTop: '-1.67em' }}>{openHours[0]}</Box>
      </TableCell>
      {dates.map((date: Date) => {
        const dayServices = getDayServices(overlappingLogisticServices, date);

        return (
          <TableCell
            key={date.toString()}
            sx={{ position: 'relative', borderLeft: (theme) => `1px solid ${theme.palette.divider}` }}
          >
            {dayServices.map((elements) => elements.map((logisticService, i) => {
              const realLogisticServiceDate = new Date(logisticService.event_date);

              return (
                <Event
                  type={type}
                  onClick={() => handleServiceClick(logisticService, dayServices)}
                  logisticService={logisticService}
                  key={logisticService.id}
                  top={`${differenceInMinutes(realLogisticServiceDate, date) / 10}rem`}
                  height={TILE_HEIGHT}
                  left={`${(100 / elements.length) * i}%`}
                  width={`${(100 / elements.length)}%`}
                />
              );
            }))}
          </TableCell>
        );
      })}
    </TableRow>
  );

  const renderTimeRows = () => openHours.map((hour, i) => {
    if (i === 0) {
      return null;
    }

    return (
      <TableRow sx={{ height: TILE_HEIGHT }} key={hour}>
        <TableCell sx={{ verticalAlign: 'baseline', borderBottom: 'unset' }}>
          <Box sx={{ marginTop: '-1.67em' }}>
            {hour.includes(':00') && hour}
          </Box>
        </TableCell>
        {dates.map((date: Date) => (
          <TableCell
            key={date.toString()}
            sx={{ position: 'relative', borderLeft: (theme) => `1px solid ${theme.palette.divider}` }}
          />
        ))}
      </TableRow>
    );
  });

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 0.15, pr: '5rem', maxWidth: '25rem' }}>
          {renderDriverAutocomplete()}
          {renderVehicleAutocomplete()}
        </Box>
        <Card sx={{ flex: 0.85 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', px: 0 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              px: '1rem',
              py: '2rem',
              justifyContent: 'space-between',
            }}
            >
              <DateRangePicker
                sx={{ width: '20rem' }}
                startDate={startDate}
                endDate={endDate}
                onChange={(value) => {
                  setStartDate(value.startDate);
                  setEndDate(value.endDate);
                }}
                clearable={false}
                label=""
                maxDaysRange={30}
              />
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
            <Box sx={{ width: '100%', overflow: 'scroll', height: '40rem' }}>
              <Table sx={{
                borderLeft: 'unset',
                borderRight: 'unset',
                borderBottom: 'unset',
                borderRadius: 0,
              }}
              >
                {renderTableHeader()}
                <TableBody>
                  {renderFirstTableRow()}
                  {renderTimeRows()}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {clickedLogisticService && config?.logistics && (
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
