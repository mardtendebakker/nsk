import { useEffect, useState } from 'react';
import ReactMapGL, {
  Marker, NavigationControl, Source, Layer,
} from 'react-map-gl';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Place from '@mui/icons-material/Place';
import { Box } from '@mui/material';
import {
  Way, fetchPolylineInfo, getMapStyle, getTransformRequest, initViewport, initialMapStyle,
} from '../../../utils/map';
import useRemoteConfig from '../../../hooks/useRemoteConfig';

export type Ways = {
  vehicleWay?: Way,
  targetWay?: Way,
};

export default function Map({ ways }:{ ways: Ways }) {
  const [mapStyle, setMapStyle] = useState(initialMapStyle);
  const [viewport, setViewport] = useState(initViewport);
  const [geometry, setGeometry] = useState<GeoJSON.LineString>({ type: 'LineString', coordinates: [] });
  const { state: { config } } = useRemoteConfig();

  const setUp = async () => {
    setGeometry((currentValue) => ({
      ...currentValue,
      coordinates: [],
    }));

    if (!ways.vehicleWay) {
      return;
    }

    if (ways.targetWay) {
      const { coordinates } = await fetchPolylineInfo([ways.vehicleWay, ways.targetWay], config.logistics.apiKey);

      setGeometry((currentValue) => ({
        ...currentValue,
        coordinates,
      }));
    }
    setViewport((currentValue) => ({
      ...currentValue,
      latitude: ways.vehicleWay.position.latitude,
      longitude: ways.vehicleWay.position.longitude,
    }));
  };

  useEffect(() => {
    if (config?.logistics.apiKey) {
      setUp();
    }
  }, [JSON.stringify(ways), JSON.stringify(config)]);

  useEffect(() => {
    getMapStyle().then(setMapStyle);
  }, []);

  return config?.logistics.apiKey ? (
    <ReactMapGL
      height="100%"
      width="100%"
      mapStyle={mapStyle}
      {...viewport}
      onViewportChange={setViewport}
      transformRequest={(url, resourceType) => getTransformRequest(url, resourceType, config.logistics.apiKey)}
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
            'line-width': 3,
            'line-opacity': 0.5,
          },
        }}
        />
      </Source>
      {ways.vehicleWay && (
      <Marker
        latitude={ways.vehicleWay.position.latitude}
        longitude={ways.vehicleWay.position.longitude}
      >
        <Box sx={{ ml: '-0.5rem', mt: '-0.5rem' }}>
          <LocalShipping />
        </Box>
      </Marker>
      )}
      {ways.targetWay && (
        <Marker
          latitude={ways.targetWay.position.latitude}
          longitude={ways.targetWay.position.longitude}
        >
          <Box sx={{ ml: '-0.5rem', mt: '-1.3rem' }}>
            <Place />
          </Box>
        </Marker>
      )}
    </ReactMapGL>
  ) : undefined;
}
