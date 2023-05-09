import {
  Box, Button, Checkbox, Typography,
} from '@mui/material';
import Loop from '@mui/icons-material/Loop';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Delete from '@mui/icons-material/Delete';
import useTranslation from '../../../hooks/useTranslation';

export default function Action({
  disabled,
  allChecked,
  checkedProductsCount,
  onAllCheck,
  onChangeStatus,
  onPrint,
  onDelete,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllCheck: (checked: boolean) => void,
  onChangeStatus: () => void,
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
          {checkedProductsCount > 0 ? `(${checkedProductsCount} ${trans('selected')})` : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {checkedProductsCount > 0
        && (
        <Button onClick={onChangeStatus} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Loop sx={{ mr: '.1rem' }} />
          {trans('changeStatus')}
        </Button>
        )}
        {checkedProductsCount > 0
        && (
        <Button onClick={onPrint} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          {trans('print')}
          <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
        </Button>
        )}
        {checkedProductsCount > 0
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
