import {
  Box, Button, Checkbox, Typography,
} from '@mui/material';
import Loop from '@mui/icons-material/Loop';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import useTranslation from '../../../hooks/useTranslation';

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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          disabled={disabled}
          checked={allChecked}
          onChange={(_, checked) => onAllCheck(checked)}
        />
        <Typography>
          {`${trans('selectAll')}`}
          {' '}
          {checkedOrdersCount > 0 ? `(${checkedOrdersCount} ${trans('selected')})` : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {checkedOrdersCount > 0
        && (
        <Button onClick={onChangeStatus} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Loop sx={{ mr: '.1rem' }} />
          {trans('changeStatus')}
        </Button>
        )}
        {checkedOrdersCount === 1
        && (
        <Button onClick={onEdit} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Edit sx={{ mr: '.1rem' }} />
          {trans('editOrder')}
        </Button>
        )}
        {checkedOrdersCount > 0
        && (
        <Button onClick={onPrint} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          {trans('print')}
          <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
        </Button>
        )}
        {checkedOrdersCount > 0
         && (
         <Button onClick={onDelete} variant="outlined" color="error" disabled={disabled}>
           <Delete sx={{ mr: '.1rem' }} />
           {trans('delete')}
         </Button>
         )}
      </Box>
    </Box>
  );
}
