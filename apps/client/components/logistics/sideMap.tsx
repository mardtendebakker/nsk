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
import { fetchWayForLogisticServices, Way, fetchPolylineInfo } from '../../utils/map';

const API_KEY = process.env.MYPTV_API_KEY;
const MAP_STYLE_URL = process.env.MYPTV_MAP_STYLE_URL;
const MAP_TILE_URL = process.env.MYPTV_MAP_TILE_URL;

function buildHomeWay() {
  return {
    address: 'Televisiestraat 2E, 2525 KD Den Haag',
    position: {
      longitude: 4.303100109100342,
      latitude: 52.057559967041016,
    },
  };
}

const initViewport = {
  longitude: 4.303100109100342,
  latitude: 52.057559967041016,
  zoom: 9,
};

const initialMapStyle = {
  version: 8,
  name: 'initial',
  sources: {
    ptv: {
      type: 'vector',
      tiles: [
        MAP_TILE_URL,
      ],
    },
  },
  layers: [],
};

const getMapStyle = (url) => fetch(url)
  .then((result) => result.json())
  .then((mapStyle) => {
    mapStyle.sources.ptv.tiles = [MAP_TILE_URL];
    return mapStyle;
  });

export default function SideMap({
  type,
  onClose,
  logisticService,
  logisticServices,
}: {
  type: 'pickup' | 'delivery',
  onClose: () => void,
  logisticService: LogisticServiceListItem,
  logisticServices: LogisticServiceListItem[]
}) {
  const { trans } = useTranslation();

  const [mapStyle, setMapStyle] = useState(initialMapStyle);
  const [viewport, setViewport] = useState(initViewport);
  const [geometry, setGeometry] = useState<GeoJSON.LineString>({ type: 'LineString', coordinates: [] });
  const [ways, setWays] = useState<Way[]>([]);
  const [travelTime, setTravelTime] = useState<string | undefined>();
  const [selectedWay, setSelectedWay] = useState<Way | undefined>();

  const handleSelectedWay = (way: Way) => {
    setViewport((oldValue) => ({
      ...oldValue,
      latitude: way.position.latitude,
      longitude: way.position.longitude,
    }));
    setSelectedWay(way);
  };

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
      ...(await fetchWayForLogisticServices(clonedLogisticServices)),
      buildHomeWay(),
    ];

    setWays(validWays);

    const { coordinates, travelTime: fetchedTravelTime } = await fetchPolylineInfo(validWays);

    setTravelTime(format(new Date(fetchedTravelTime * 1000), 'HH:mm:ss'));
    setGeometry({
      ...geometry,
      coordinates,
    });

    const wayToSelect = validWays.find((validWay: Way) => validWay?.logisticService?.id == logisticService.id);

    if (wayToSelect) {
      handleSelectedWay(wayToSelect);
    }
  }

  useEffect(() => {
    getMapStyle(MAP_STYLE_URL).then(setMapStyle);
    setUp();
  }, []);

  const getTransformRequest = (url, resourceType) => {
    if (resourceType === 'Tile') {
      return { url, headers: { ApiKey: API_KEY } };
    }

    return { url, headers: {} };
  };

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
          transformRequest={(url, resourceType) => getTransformRequest(url, resourceType)}
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
            {logisticService?.logistic?.username || '--'}
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
            label={trans('supplier')}
            placeholder={trans('selectSupplier')}
            value={selectedWay?.logisticService?.id || 'none'}
            onChange={(e) => handleSelectedWay(ways.find((way: Way) => e.target.value == way?.logisticService?.id?.toString()))}
            options={ways
              .filter((way: Way) => !!way.logisticService)
              .map((way: Way) => ({
                title: way.logisticService.order.supplier.name,
                value: way.logisticService.id,
              }))}
          />
          {selectedWay?.logisticService && (
            <Box sx={{ mb: '.5rem', mt: '.5rem' }}>
              <Typography color="divider" variant="body1" sx={{ mb: '.5rem' }}>
                {trans('supplierInfo')}
                :
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: '1rem' }}>
                  <Typography variant="h5">
                    {selectedWay.logisticService.order.supplier.name.charAt(0)?.toUpperCase()}
                  </Typography>
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {selectedWay.logisticService.order.supplier.name}
                  </Typography>
                  <Typography variant="body1">{selectedWay.logisticService.order.supplier.representative}</Typography>

                  <Typography variant="body1" sx={{ justifySelf: 'flex-end' }}>
                    {selectedWay.logisticService.order.supplier.phone}
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
                  {logisticService.logistic
                    ? (logisticService.logistic.firstname.charAt(0)?.toUpperCase() || '') + (logisticService.logistic.lastname.charAt(0)?.toUpperCase() || '')
                    : '--'}
                </Typography>
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {logisticService.logistic
                    ? `${logisticService.logistic.firstname} ${logisticService.logistic.lastname}`
                    : '--'}
                </Typography>
                <Typography variant="body1">{logisticService.logistic?.username || '--'}</Typography>
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
              <Typography variant="h5">
                {logisticService.logistic?.username || '--'}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            variant="contained"
            sx={{ width: '100%', mt: '1rem' }}
            onClick={() => window.open(type == 'delivery' ? ORDERS_SALES_EDIT : ORDERS_PURCHASES_EDIT.replace('[id]', logisticService.order.id.toString()), '_blank')}
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
