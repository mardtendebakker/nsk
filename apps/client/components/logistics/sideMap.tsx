import {
  Box, Divider, Drawer, Tooltip, Typography, Button, Avatar,
} from '@mui/material';
import TimerOutlined from '@mui/icons-material/TimerOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL, {
  Marker, NavigationControl, Source, Layer,
} from 'react-map-gl';
import { format } from 'date-fns';
import { LogisticServiceListItem } from '../../utils/axios/models/logistic';
import useTranslation from '../../hooks/useTranslation';
import { ORDERS_PURCHASES_EDIT, ORDERS_SALES_EDIT } from '../../utils/routes';
import Select from '../memoizedInput/select';
import {
  fetchWayForLogisticServices, fetchPolylineInfo, LogisticWay, getTransformRequest, initialMapStyle, initViewport, getMapStyle,
} from '../../utils/map';

function buildHomeWay() {
  return {
    address: 'Televisiestraat 2E, 2525 KD Den Haag',
    position: {
      longitude: 4.303100109100342,
      latitude: 52.057559967041016,
    },
  };
}

export default function SideMap({
  type,
  onClose,
  logisticService,
  logisticServices,
  apiKey,
}: {
  type: 'pickup' | 'delivery',
  onClose: () => void,
  logisticService: LogisticServiceListItem,
  logisticServices: LogisticServiceListItem[],
  apiKey: string
}) {
  const { trans } = useTranslation();

  const [mapStyle, setMapStyle] = useState(initialMapStyle);
  const [viewport, setViewport] = useState(initViewport);
  const [geometry, setGeometry] = useState<GeoJSON.LineString>({ type: 'LineString', coordinates: [] });
  const [ways, setWays] = useState<LogisticWay[]>([]);
  const [travelTime, setTravelTime] = useState<string | undefined>();
  const [selectedWay, setSelectedWay] = useState<LogisticWay | undefined>();

  const handleSelectedWay = (way: LogisticWay) => {
    setViewport((oldValue) => ({
      ...oldValue,
      latitude: way.position.latitude,
      longitude: way.position.longitude,
    }));
    setSelectedWay(way);
  };

  const getContactOfWay = (way: LogisticWay) => (type === 'delivery'
    ? way.logisticService.order.customer
    : way.logisticService.order.supplier);

  async function setUp() {
    const clonedLogisticServices = structuredClone(logisticServices);

    clonedLogisticServices.sort((a: LogisticServiceListItem, b: LogisticServiceListItem) => {
      if (a.event_date < b.event_date) {
        return -1;
      } if (a.event_date > b.event_date) {
        return 1;
      }

      return 0;
    });

    const validWays = [
      buildHomeWay(),
      ...(await fetchWayForLogisticServices(clonedLogisticServices, apiKey)),
      buildHomeWay(),
    ];

    setWays(validWays);

    const { coordinates, travelTime: fetchedTravelTime } = await fetchPolylineInfo(validWays, apiKey);

    setTravelTime(format(new Date(fetchedTravelTime * 1000), 'HH:mm:ss'));
    setGeometry({
      ...geometry,
      coordinates,
    });

    const wayToSelect = validWays.find((validWay: LogisticWay) => validWay?.logisticService?.id == logisticService.id);

    if (wayToSelect) {
      handleSelectedWay(wayToSelect);
    }
  }

  useEffect(() => {
    getMapStyle().then(setMapStyle);
    setUp();
  }, []);

  const waysLength = ways.length;

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
    >
      <Box sx={{
        width: '70vw', display: 'flex',
      }}
      >
        <ReactMapGL
          height="100vh"
          width="100vw"
          mapStyle={mapStyle}
          {...viewport}
          onViewportChange={setViewport}
          transformRequest={(url, resourceType) => getTransformRequest(url, resourceType, apiKey)}
        >
          <NavigationControl style={{ right: 10, top: 10 }} />
          <Source
            type="geojson"
            data={{
              type: 'Feature',
              properties: {},
              geometry,
            }}
          >
            <Layer {...{
              id: 'data',
              type: 'line',
              paint: {
                'line-color': '#ff1a1a',
                'line-width': 5,
                'line-opacity': 0.5,
              },
            }}
            />
          </Source>
          {ways.map((way, i: number): JSX.Element | undefined => {
            if (i == waysLength - 1) {
              return undefined;
            }

            return (
              <Marker
                key={way.address}
                latitude={way.position.latitude}
                longitude={way.position.longitude}
                onClick={() => handleSelectedWay(way)}
              >
                <Tooltip title={way.address}>
                  <Box sx={{
                    opacity: 0.5,
                    color: 'white',
                    width: '1.5rem',
                    height: '1.5rem',
                    bgcolor: '#000000',
                    borderRadius: '.3rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  >
                    {i == 0 ? 'H' : i}
                  </Box>
                </Tooltip>
              </Marker>
            );
          })}
        </ReactMapGL>
        <Box sx={{
          p: '1rem', maxWidth: '22rem', minWidth: '22rem', lineBreak: 'anywhere',
        }}
        >
          <Typography variant="h5" sx={{ mb: '.5rem', display: 'flex', alignItems: 'center' }}>
            <LocalShippingOutlined sx={{ mr: '.5rem', fontSize: '1.2rem' }} />
            {trans('logisticServiceBy')}
            {': '}
            {logisticService?.driver?.username || '--'}
          </Typography>
          <Typography variant="body1" sx={{ mb: '1rem', display: 'flex', alignItems: 'center' }}>
            <TimerOutlined sx={{ mr: '.5rem', fontSize: '1.2rem' }} />
            {' '}
            {trans('estimatedTravelTime')}
            {': '}
            {travelTime}
          </Typography>
          <Divider sx={{ my: '.5rem' }} />

          <Select
            sx={{ width: '100%' }}
            label={trans(type == 'delivery' ? 'customer' : 'supplier')}
            placeholder={trans(type == 'delivery' ? 'selectCustomer' : 'selectSupplier')}
            value={selectedWay?.logisticService?.id || 'none'}
            onChange={(e) => handleSelectedWay(ways.find((way: LogisticWay) => e.target.value == way?.logisticService?.id?.toString()))}
            options={ways
              .filter((way: LogisticWay) => !!way.logisticService)
              .map((way: LogisticWay) => ({
                title: `${getContactOfWay(way).name} - ${getContactOfWay(way).company_name}`,
                value: way.logisticService.id,
              }))}
          />
          {selectedWay?.logisticService && (
            <Box sx={{ mb: '.5rem', mt: '.5rem' }}>
              <Typography color="divider" variant="body1" sx={{ mb: '.5rem' }}>
                {trans(type == 'delivery' ? 'customerInfo' : 'supplierInfo')}
                :
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: '1rem' }}>
                  <Typography variant="h5">
                    {getContactOfWay(selectedWay)?.name?.charAt(0)?.toUpperCase()
                    || getContactOfWay(selectedWay)?.company_name?.charAt(0)?.toUpperCase()}
                  </Typography>
                </Avatar>
                <Box>
                  <Typography variant="body1">{getContactOfWay(selectedWay).name}</Typography>
                  <Typography variant="h5">
                    {getContactOfWay(selectedWay).company_name}
                  </Typography>

                  <Typography variant="body1" sx={{ justifySelf: 'flex-end' }}>
                    {getContactOfWay(selectedWay).phone}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'end' }} />
              </Box>
              <Divider sx={{ mt: '.5rem' }} />
            </Box>
          )}
          <Box sx={{ mb: '.5rem' }}>
            <Typography color="divider" variant="body1" sx={{ mb: '.5rem' }}>
              {trans('driverInfo')}
              :
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: '1rem' }}>
                <Typography variant="h5">
                  {logisticService.driver
                    ? (logisticService.driver.first_name.charAt(0)?.toUpperCase() || '') + (logisticService.driver.last_name.charAt(0)?.toUpperCase() || '')
                    : '--'}
                </Typography>
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {logisticService.driver
                    ? `${logisticService.driver.first_name} ${logisticService.driver.last_name}`
                    : '--'}
                </Typography>
                <Typography variant="body1">{logisticService.driver?.username || '--'}</Typography>
              </Box>
            </Box>
            <Divider sx={{ mt: '.5rem' }} />
          </Box>
          <Box sx={{ mb: '.5rem' }}>
            <Typography color="divider" variant="body1" sx={{ mb: '.5rem' }}>
              {trans('vehicleInfo')}
              :
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: '1rem' }}><LocalShippingOutlined sx={{ fontSize: '1.2rem' }} /></Avatar>
              <Box>
                <Typography variant="h5">
                  {logisticService.vehicle?.registration_number || '--'}
                </Typography>
                <Typography variant="body1">{logisticService.vehicle?.name || '--'}</Typography>
              </Box>
            </Box>
          </Box>
          <Button
            size="small"
            variant="contained"
            sx={{ width: '100%', mt: '1rem' }}
            onClick={() => window.open((type == 'delivery' ? ORDERS_SALES_EDIT : ORDERS_PURCHASES_EDIT).replace('[id]', logisticService.order.id.toString()), '_blank')}
          >
            <VisibilityOutlined />
            {' '}
            {trans('viewOrder')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
