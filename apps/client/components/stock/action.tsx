import {
  Box, Button, Checkbox, Typography,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import ChevronRight from '@mui/icons-material/ChevronRight';
import useTranslation from '../../hooks/useTranslation';
import ChangeLocationButton from './changeLocationButton';
import ChangeAvailabilityButton from './changeAvailabilityButton';
import AssignButton from './assignButton';
import EditProductButton from './editProductButton';

export default function Action({
  disabled,
  allChecked,
  checkedProductsCount,
  onAllChecked,
  onChangeLocation,
  onChangeAvailability,
  onEdit,
  onAssign,
  onPrint,
  onDelete,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllChecked: (checked: boolean) => void,
  onChangeLocation: (location: string) => void,
  onChangeAvailability: (availability: string) => void,
  onEdit: () => void,
  onAssign: (assigned: string) => void,
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
        {checkedProductsCount > 0 && <ChangeLocationButton onClick={() => {}} sx={{ mr: '1rem' }} disabled={disabled} />}
        {checkedProductsCount > 0 && <ChangeAvailabilityButton onClick={() => {}} sx={{ mr: '1rem' }} disabled={disabled} />}
        {checkedProductsCount === 1 && <EditProductButton onClick={onEdit} sx={{ mr: '1rem' }} disabled={disabled} />}
        {checkedProductsCount > 0 && <AssignButton onClick={() => {}} sx={{ mr: '1rem' }} disabled={disabled} />}
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
