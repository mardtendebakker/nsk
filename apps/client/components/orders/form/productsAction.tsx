import {
  Box,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import Checkbox from '../../checkbox';
import PrintActions from '../../printActions';

export default function ProductsAction({
  disabled,
  allChecked,
  checkedProductsCount,
  onAllCheck,
  onPrint,
  onPrintChecklist,
  onPrintPriceCard,
  onPrintLabel,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllCheck: (checked: boolean) => void,
  onPrint: () => void,
  onPrintChecklist: () => void,
  onPrintPriceCard: () => void,
  onPrintLabel: () => void,
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
        <PrintActions
          disabled={disabled}
          onPrint={onPrint}
          onPrintChecklist={onPrintChecklist}
          onPrintPriceCard={onPrintPriceCard}
          onPrintLabel={onPrintLabel}
        />
        )}
      </Box>
    </Box>
  );
}
