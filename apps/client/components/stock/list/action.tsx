import {
  Box, Button,
} from '@mui/material';
import EditLocation from '@mui/icons-material/EditLocation';
import Category from '@mui/icons-material/Category';
import Archive from '@mui/icons-material/Archive';
import AddBusiness from '@mui/icons-material/AddBusiness';
import Unarchive from '@mui/icons-material/Unarchive';
import useTranslation from '../../../hooks/useTranslation';
import Checkbox from '../../checkbox';
import Can from '../../can';
import { ProductType } from '../type';
import PrintActions from '../../printActions';
import useResponsive from '../../../hooks/useResponsive';

export default function Action({
  disabled,
  type,
  allChecked,
  checkedProductsCount,
  onAllCheck,
  onArchive,
  onUnarchive,
  onChangeLocation,
  onChangeProductType,
  onPrint,
  onPrintChecklist,
  onPrintPriceCard,
  onPrintLabel,
  onPublishToStore,
}:{
  disabled: boolean,
  type: ProductType,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllCheck: (checked: boolean) => void,
  onArchive: () => void,
  onUnarchive: () => void,
  onChangeLocation: () => void,
  onChangeProductType: () => void,
  onPrint: () => void,
  onPrintChecklist: () => void,
  onPrintPriceCard: () => void,
  onPrintLabel: () => void,
  onPublishToStore: () => void
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: isDesktop ? undefined : 'column' }}>
      <Checkbox
        disabled={disabled}
        checked={allChecked}
        onCheck={onAllCheck}
        label={`${trans('selectAll')} ${checkedProductsCount > 0 ? `(${checkedProductsCount} ${trans('selected')})` : ''}`}
      />
      <Box sx={{
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-start',
        flexDirection: isDesktop ? undefined : 'column',
      }}
      >
        {checkedProductsCount > 0 && ['product', 'webshop'].includes(type)
        && (
          <Can requiredGroups={['store_publisher', 'admin', 'manager']}>
            <Button size="small" onClick={onPublishToStore} sx={{ m: '.5rem' }} variant="outlined" color="primary" disabled={disabled}>
              <AddBusiness sx={{ mr: '.1rem' }} />
              {trans('publishToStore')}
            </Button>
          </Can>
        )}
        {checkedProductsCount > 0 && type !== 'archived'
        && (
        <Button size="small" onClick={onArchive} sx={{ m: '.5rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Archive sx={{ mr: '.1rem' }} />
          {trans('archive')}
        </Button>
        )}
        {checkedProductsCount > 0 && type === 'archived'
        && (
        <Button size="small" onClick={onUnarchive} sx={{ m: '.5rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Unarchive sx={{ mr: '.1rem' }} />
          {trans('unarchive')}
        </Button>
        )}
        {checkedProductsCount > 0
        && (
          <Can requiredGroups={['manager']}>
            <Button size="small" onClick={onChangeLocation} sx={{ m: '.5rem' }} variant="outlined" color="primary" disabled={disabled}>
              <EditLocation sx={{ mr: '.1rem' }} />
              {trans('changeLocation')}
            </Button>
          </Can>
        )}
        {checkedProductsCount > 0
        && (
          <Can requiredGroups={['manager']}>
            <Button size="small" onClick={onChangeProductType} sx={{ m: '.5rem' }} variant="outlined" color="primary" disabled={disabled}>
              <Category sx={{ mr: '.1rem' }} />
              {trans('changeProductType')}
            </Button>
          </Can>
        )}
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
