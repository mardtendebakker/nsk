import { Box } from '@mui/material';
import { useCallback } from 'react';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { AUTOCOMPLETE_PRODUCT_STATUSES_PATH } from '../../../utils/axios';
import ConfirmationDialog from '../../confirmationDialog';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import Select from '../../memoizedInput/select';
import TextField from '../../memoizedInput/textField';
import Checkbox from '../../checkbox';
import { ProductListItem } from '../../../utils/axios/models/product';

export interface SplitData {
  mode: 'individualize' | 'newBundle',
  value: number,
  statusId?: number,
  newSKU: boolean,
}

export default function SplitModal({ onClose, onConfirm, product }:{
  onClose: () => void,
  onConfirm: (data: SplitData)=>void,
  product: ProductListItem
}) {
  const { trans } = useTranslation();

  const initFormState = (): FormRepresentation => ({
    mode: { required: true, value: 'newBundle' },
    value: {
      required: true,
      value: '',
      validator: (({ value }): string | undefined => {
        if (value.value >= product.stockQuantity) {
          const vars = new Map();
          vars.set('value', product.stockQuantity - 1);
          return trans('splitModal.maxStockExceeded', { vars });
        }
        if (value.value < 1) {
          return trans('required');
        }
      }),
    },
    statusId: {},
    newSKU: { value: false },
  });

  const { setValue, formRepresentation, validate } = useForm(useCallback(() => initFormState(), [])());

  const handleConfirm = () => {
    if (validate()) {
      return;
    }
    onConfirm({
      mode: formRepresentation.mode.value,
      value: formRepresentation.value.value * 1,
      statusId: formRepresentation.statusId.value,
      newSKU: formRepresentation.newSKU.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirm();
  };

  return (
    <ConfirmationDialog
      title={<>{trans('split')}</>}
      content={(
        <form onSubmit={handleSubmit}>
          <Select
            fullWidth
            label={trans('splitMode')}
            helperText={formRepresentation.mode.error}
            error={!!formRepresentation.mode.error}
            value={formRepresentation.mode.value}
            options={[{ title: trans('splitModal.newBundle'), value: 'newBundle' }, { title: trans('splitModal.individualize'), value: 'individualize' }]}
            onChange={(e) => {
              setValue({ field: 'mode', value: e.target.value });
            }}
          />
          <TextField
            sx={{ mt: '.5rem' }}
            label={trans('value')}
            helperText={formRepresentation.value.error}
            error={!!formRepresentation.value.error}
            type="number"
            fullWidth
            value={formRepresentation.value.value}
            onChange={(e) => setValue({ field: 'value', value: e.target.value })}
          />
          <DataSourcePicker
            fullWidth
            sx={{ mt: '.5rem' }}
            path={AUTOCOMPLETE_PRODUCT_STATUSES_PATH}
            label={trans('newStatus')}
            placeholder={trans('selectStatus')}
            onChange={(selected: { id: number }) => setValue({ field: 'statusId', value: selected?.id })}
            value={formRepresentation.statusId.value?.toString()}
          />
          <Box sx={{ mt: '.5rem' }} />
          <Checkbox
            onCheck={(checked) => setValue({ field: 'newSKU', value: checked })}
            checked={formRepresentation.newSKU.value}
            label={trans('newSKU')}
          />
          <input type="submit" style={{ display: 'none' }} />
        </form>
        )}
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmButtonText={trans('save')}
    />
  );
}
