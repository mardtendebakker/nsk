import {
  MenuItem, MenuList,
} from '@mui/material';
import { Driver } from '../../utils/axios/models/logistic';
import MenuItemText from '../menuTextItem';
import useTranslation from '../../hooks/useTranslation';

export default function DriversList({
  onClick,
  selectedDriverIds,
  drivers,
}: {
  onClick: (logistiId: number) => void,
  selectedDriverIds: number[],
  drivers: Driver[]
}) {
  const { trans } = useTranslation();

  return (
    <MenuList>
      <MenuItem
        onClick={() => onClick(0)}
        sx={(theme) => ({
          borderRadius: '.25rem',
          fontWeight: theme.typography.fontWeightMedium,
          background: selectedDriverIds[0] === 0 ? theme.palette.primary.light : undefined,
          color: selectedDriverIds[0] === 0 ? theme.palette.primary.main : undefined,
          mb: '.2rem',
          p: '.5rem .75rem',
        })}
      >
        <MenuItemText active={selectedDriverIds[0] === 0}>
          {trans('everyone')}
        </MenuItemText>
      </MenuItem>
      {drivers.map((driver: Driver) => {
        const active = !!selectedDriverIds.find((element) => element == driver.id);
        return (
          <MenuItem
            onClick={() => onClick(driver.id)}
            key={driver.id}
            sx={(theme) => ({
              borderRadius: '.25rem',
              fontWeight: theme.typography.fontWeightMedium,
              background: active ? theme.palette.primary.light : undefined,
              color: active ? theme.palette.primary.main : undefined,
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
              mb: '1rem',
              p: '.5rem .75rem',
            })}
          >
            <MenuItemText active={active}>
              {driver.username}
            </MenuItemText>
          </MenuItem>
        );
      })}
    </MenuList>
  );
}
