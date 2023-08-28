import { Box, Button } from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import EditLocation from '@mui/icons-material/EditLocation';
import useTranslation from '../../../hooks/useTranslation';
import Checkbox from '../../checkbox';

export default function Action({
  disabled,
  allChecked,
  checkedProductsCount,
  onAllCheck,
  onChangeLocation,
  onPrint,
  onPrintChecklist,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllCheck: (checked: boolean) => void,
  onChangeLocation: () => void,
  onPrint: () => void,
  onPrintChecklist: () => void,
}) {
  const { trans } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Checkbox
        disabled={disabled}
        checked={allChecked}
        onCheck={onAllCheck}
        label={`${trans('selectAll')} ${checkedProductsCount > 0 ? `(${checkedProductsCount} ${trans('selected')})` : ''}`}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {checkedProductsCount > 0
        && (
        <Button size="small" onClick={onChangeLocation} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <EditLocation sx={{ mr: '.1rem' }} />
          {trans('changeLocation')}
        </Button>
        )}
        {checkedProductsCount > 0
        && (
          <Button size="small" onClick={onPrint} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
              {trans('printBarcode')}
            <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
          </Button>
        )}
        {checkedProductsCount > 0
        && (
          <Button size="small" onClick={onPrintChecklist} variant="outlined" color="primary" disabled={disabled}>
              {trans('printChecklist')}
            <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
          </Button>
        )}
      </Box>
    </Box>
  );
}
