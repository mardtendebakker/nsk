import {
  Box, Button, Checkbox, Typography,
} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Bolt from '@mui/icons-material/Bolt';
import Edit from '@mui/icons-material/Edit';
import EditLocation from '@mui/icons-material/EditLocation';
import useTranslation from '../../../hooks/useTranslation';
import Delete from '../../button/delete';

export default function Action({
  disabled,
  allChecked,
  checkedProductsCount,
  onAllCheck,
  onChangeLocation,
  onSplit,
  onEdit,
  onPrint,
  onDelete,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllCheck: (checked: boolean) => void,
  onChangeLocation: () => void,
  onSplit: () => void,
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
        <Button size="small" onClick={onChangeLocation} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <EditLocation sx={{ mr: '.1rem' }} />
          {trans('changeLocation')}
        </Button>
        )}
        {checkedProductsCount === 1
        && (
        <>
          <Button size="small" onClick={onEdit} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
            <Edit sx={{ mr: '.1rem' }} />
            {trans('editProduct')}
          </Button>
          <Button size="small" onClick={onSplit} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
            {trans('split')}
            <Bolt />
          </Button>
        </>
        )}
        {checkedProductsCount > 0
        && (
          <>
            <Button size="small" onClick={onPrint} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
              {trans('print')}
              <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
            </Button>
            <Delete onDelete={onDelete} disabled={disabled} />
          </>
        )}
      </Box>
    </Box>
  );
}
