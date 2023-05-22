import {
  Box, Button, Checkbox, Typography,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Edit from '@mui/icons-material/Edit';
import EditLocation from '@mui/icons-material/EditLocation';
import useTranslation from '../../../hooks/useTranslation';

export default function Action({
  disabled,
  allChecked,
  checkedProductsCount,
  onAllCheck,
  onChangeLocation,
  onEdit,
  onPrint,
  onDelete,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllCheck: (checked: boolean) => void,
  onChangeLocation: () => void,
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
          {checkedProductsCount > 0 ? `(${checkedProductsCount} ${trans('selected')})` : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {checkedProductsCount > 0
        && (
        <Button onClick={onChangeLocation} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <EditLocation sx={{ mr: '.1rem' }} />
          {trans('changeLocation')}
        </Button>
        )}
        {checkedProductsCount === 1
        && (
        <Button onClick={onEdit} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Edit sx={{ mr: '.1rem' }} />
          {trans('editProduct')}
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