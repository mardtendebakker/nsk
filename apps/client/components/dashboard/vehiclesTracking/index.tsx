import {
  Avatar,
  Box, Card, CardContent, Divider, Tooltip, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import useTranslation from '../../../hooks/useTranslation';
import GeoMap, { Ways } from './map';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { VEHICLES_TODAY_PICKUPS_PATH, VEHICLES_PATH, AxiosResponse } from '../../../utils/axios';
import { Vehicle } from '../../../utils/axios/models/vehicle';
import { LogisticServiceListItem } from '../../../utils/axios/models/logistic';
import RunningStatus from './runnningStatus';
import { fetchWayForLogisticService } from '../../../utils/map';
import useAxios from '../../../hooks/useAxios';
import useSecurity from '../../../hooks/useSecurity';
import can from '../../../utils/can';
import useRemoteConfig from '../../../hooks/useRemoteConfig';

export default function VehiclesTracking() {
  const { trans } = useTranslation();
  const [vehicle, setVehicle] = useState<Vehicle | undefined>();
  const [pickup, setPickup] = useState<LogisticServiceListItem | undefined>();
  const [ways, setWays] = useState<Ways>({ vehicleWay: undefined, targetWay: undefined });
  const { call } = useAxios('get', VEHICLES_PATH);
  const { hasModule, state: { user } } = useSecurity();
  const { state: { config } } = useRemoteConfig();

  const buildVehicleWay = (value: Vehicle) => ({ address: '', position: { latitude: value.location.latitude, longitude: value.location.longitude } });

  const handleSelectVehicle = (value?: Vehicle) => {
    if (!value) {
      setWays({
        vehicleWay: undefined,
        targetWay: undefined,
      });
      setVehicle(undefined);
    } else {
      setWays({
        vehicleWay: buildVehicleWay(value),
        targetWay: undefined,
      });
      setVehicle(value);
    }
  };

  const handleSelectPickup = async (value?: LogisticServiceListItem) => {
    const apiKey = config?.logistics.apiKey;

    if (!apiKey) {
      return;
    }

    if (!value) {
      setWays((currentValue) => ({
        ...currentValue,
        targetWay: undefined,
      }));
      setPickup(undefined);
    } else {
      const targetWay = await fetchWayForLogisticService(value, apiKey);

      setWays((currentValue) => ({
        ...currentValue,
        targetWay,
      }));
      setPickup(value);
    }
  };

  const hasTracking = hasModule('tracking');

  const hasRequiredGroups = user && can({ user, requiredGroups: ['logistics'] });

  useEffect(() => {
    const interval = setInterval(() => {
      if (vehicle) {
        call().then(({ data = [] }: AxiosResponse) => {
          const foundVehicle = data.find(({ id }) => id === vehicle.id);
          setVehicle(foundVehicle);
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [JSON.stringify(vehicle)]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          {trans('vehiclesTracking')}
        </Typography>
        <Box sx={{ height: '20rem', mb: '1rem' }}>
          <GeoMap ways={ways} />
        </Box>
        <Tooltip title={!hasTracking && trans('inactiveModuleMessage', { vars: (new Map()).set('module', 'tracking') })}>
          <span>
            <DataSourcePicker
              disabled={!hasTracking || !hasRequiredGroups}
              sx={{ mb: '1rem' }}
              path={VEHICLES_PATH}
              label={trans('vehicle')}
              placeholder={trans('selectVehicle')}
              onChange={handleSelectVehicle}
              formatter={({ id, ...rest }: Vehicle) => ({ id, label: rest.licensePlate, ...rest })}
              value={vehicle?.id?.toString()}
              fetchOnSearch={false}
            />
          </span>
        </Tooltip>
        {vehicle && (
        <>
          <RunningStatus vehicle={vehicle} />
          <br />
          {`${vehicle.make} ${vehicle.model}`}
          <br />
          {vehicle.description}
        </>
        )}
        {vehicle && (
        <DataSourcePicker
          sx={{ mt: '1rem' }}
          path={VEHICLES_TODAY_PICKUPS_PATH.replace(':licensePlate', vehicle.licensePlate)}
          label={trans('supplier')}
          placeholder={trans('selectSupplier')}
          onChange={handleSelectPickup}
          formatter={({ id, ...rest }: LogisticServiceListItem) => ({
            id,
            label: rest.order.supplier.name
            || rest.order.supplier.company_name,
            ...rest,
          })}
          value={vehicle?.id?.toString()}
          fetchOnSearch={false}
        />
        )}
        <Divider sx={{ my: '1rem' }} />
        {vehicle && pickup && (
          <>
            <Box sx={{ mb: '.5rem', mt: '.5rem' }}>
              <Typography color="divider" variant="body1" sx={{ mb: '.5rem' }}>
                {trans('supplierInfo')}
                :
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: '1rem' }}>
                  <Typography variant="h5">
                    {pickup.order.supplier?.name?.charAt(0)?.toUpperCase()
                  || pickup.order.supplier?.company_name?.charAt(0)?.toUpperCase()}
                  </Typography>
                </Avatar>
                <Box>
                  <Typography variant="body1">{pickup.order.supplier.name}</Typography>
                  <Typography variant="h5">
                    {pickup.order.supplier.company_name}
                  </Typography>

                  <Typography variant="body1" sx={{ justifySelf: 'flex-end' }}>
                    {pickup.order.supplier.phone}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'end' }} />
              </Box>
              <Divider sx={{ mt: '.5rem' }} />
            </Box>
            <Box sx={{ mb: '.5rem' }}>
              <Typography color="divider" variant="body1" sx={{ mb: '.5rem' }}>
                {trans('driverInfo')}
                :
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: '1rem' }}>
                  <Typography variant="h5">
                    {pickup.driver
                      ? (pickup.driver.first_name.charAt(0)?.toUpperCase() || '') + (pickup.driver.last_name.charAt(0)?.toUpperCase() || '')
                      : '--'}
                  </Typography>
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {pickup.driver
                      ? `${pickup.driver.first_name} ${pickup.driver.last_name}`
                      : '--'}
                  </Typography>
                  <Typography variant="body1">{pickup.driver?.username || '--'}</Typography>
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
                  {pickup.vehicle?.registration_number || '--'}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
