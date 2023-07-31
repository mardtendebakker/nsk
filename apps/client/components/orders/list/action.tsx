import { Box, Button } from '@mui/material';
import Loop from '@mui/icons-material/Loop';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Edit from '@mui/icons-material/Edit';
import useTranslation from '../../../hooks/useTranslation';
import Delete from '../../button/delete';
import Checkbox from '../../checkbox';

export default function Action({
  disabled,
  allChecked,
  checkedOrdersCount,
  onAllCheck,
  onChangeStatus,
  onEdit,
  onPrint,
  onDelete,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedOrdersCount: number,
  onAllCheck: (checked: boolean) => void,
  onChangeStatus: () => void,
  onEdit: () => void,
  onPrint: () => void,
  onDelete: () => void,
}) {
  const { trans } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Checkbox
        disabled={disabled}
        checked={allChecked}
        onCheck={onAllCheck}
        label={`${trans('selectAll')} ${checkedOrdersCount > 0 ? `(${checkedOrdersCount} ${trans('selected')})` : ''}`}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {checkedOrdersCount > 0
        && (
        <Button size="small" onClick={onChangeStatus} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Loop sx={{ mr: '.1rem' }} />
          {trans('changeStatus')}
        </Button>
        )}
        {checkedOrdersCount === 1
        && (
        <Button size="small" onClick={onEdit} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Edit sx={{ mr: '.1rem' }} />
          {trans('editOrder')}
        </Button>
        )}
        {checkedOrdersCount > 0
        && (
        <Button size="small" onClick={onPrint} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          {trans('print')}
          <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
        </Button>
        )}
        {checkedOrdersCount > 0 && (<Delete onDelete={onDelete} disabled={disabled} />)}
      </Box>
    </Box>
  );
}
