import { Box, Button } from '@mui/material';
import Loop from '@mui/icons-material/Loop';
import ChevronRight from '@mui/icons-material/ChevronRight';
import useTranslation from '../../../hooks/useTranslation';
import Checkbox from '../../checkbox';
import Can from '../../can';

export default function Action({
  disabled,
  allChecked,
  checkedOrdersCount,
  onAllCheck,
  onChangeStatus,
  onPrint,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedOrdersCount: number,
  onAllCheck: (checked: boolean) => void,
  onChangeStatus: () => void,
  onPrint: () => void,
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
          <Can requiredGroups={['manager', 'logistics']}>
            <Button size="small" onClick={onChangeStatus} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
              <Loop sx={{ mr: '.1rem' }} />
              {trans('changeStatus')}
            </Button>
          </Can>
        )}
        {checkedOrdersCount > 0
        && (
        <Button size="small" onClick={onPrint} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          {trans('print')}
          <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
        </Button>
        )}
      </Box>
    </Box>
  );
}
