import {
  Box, Button, Checkbox, Typography,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Edit from '@mui/icons-material/Edit';
import EditLocation from '@mui/icons-material/EditLocation';
import PersonAddAlt1 from '@mui/icons-material/PersonAddAlt1';
import useTranslation from '../../hooks/useTranslation';

export default function Action({
  disabled,
  allChecked,
  checkedProductsCount,
  onAllChecked,
  onChangeLocation,
  onEdit,
  onAssign,
  onPrint,
  onDelete,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllChecked: (checked: boolean) => void,
  onChangeLocation: () => void,
  onEdit: () => void,
  onAssign: () => void,
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
          onChange={(_, checked) => onAllChecked(checked)}
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
        <Button onClick={onAssign} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <PersonAddAlt1 sx={{ mr: '.3rem' }} />
          {trans('assign')}
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