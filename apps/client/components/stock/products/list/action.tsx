import {
  Box, Checkbox, Typography,
} from '@mui/material';
import useTranslation from '../../../../hooks/useTranslation';
import ChangeLocationButton from '../../changeLocationButton';
import ChangeAvailabilityButton from '../../changeAvailabilityButton';
import AssignButton from '../../assignButton';
import PrintButton from '../../printButton';
import DeleteButton from '../../deleteButton';
import EditProductButton from '../../editProductButton';

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
        {checkedProductsCount > 0 && <PrintButton onClick={() => {}} sx={{ mr: '1rem' }} disabled={disabled} />}
        {checkedProductsCount > 0 && <DeleteButton onClick={() => {}} disabled={disabled} />}
      </Box>
    </Box>
  );
}
