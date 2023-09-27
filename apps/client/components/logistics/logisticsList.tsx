import {
  MenuItem, MenuList,
} from '@mui/material';
import { Logistic } from '../../utils/axios/models/pickup';
import MenuItemText from '../menuTextItem';
import useTranslation from '../../hooks/useTranslation';

export default function LogisticsList({
  onClick,
  selectedLogisticIds,
  logistics,
}: {
  onClick: (logistiId: number) => void,
  selectedLogisticIds: number[],
  logistics: Logistic[]
}) {
  const { trans } = useTranslation();

  return (
    <MenuList>
      <MenuItem
        onClick={() => onClick(0)}
        sx={(theme) => ({
          borderRadius: '.25rem',
          fontWeight: theme.typography.fontWeightMedium,
          background: selectedLogisticIds[0] === 0 ? theme.palette.primary.light : undefined,
          color: selectedLogisticIds[0] === 0 ? theme.palette.primary.main : undefined,
          mb: '.2rem',
          p: '.5rem .75rem',
        })}
      >
        <MenuItemText active={selectedLogisticIds[0] === 0}>
          {trans('everyone')}
        </MenuItemText>
      </MenuItem>
      {logistics.map((logistic: Logistic) => {
        const active = !!selectedLogisticIds.find((element) => element == logistic.id);
        return (
          <MenuItem
            onClick={() => onClick(logistic.id)}
            key={logistic.id}
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
              {logistic.username}
            </MenuItemText>
          </MenuItem>
        );
      })}
    </MenuList>
  );
}
