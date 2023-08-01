import { Box } from '@mui/material';
import useForm from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { PRODUCT_STATUSES_PATH } from '../../../utils/axios';
import ConfirmationDialog from '../../confirmationDialog';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import Select from '../../memoizedInput/select';
import TextField from '../../memoizedInput/textField';
import Checkbox from '../../checkbox';

export interface SplitData {
  mode: 'individualize' | 'newBundle',
  value: number,
  statusId?: number,
  newSKU: boolean,
}

const initFormState = {
  mode: { required: true, value: 'newBundle' },
  value: { required: true, value: 0 },
  statusId: {},
  newSKU: { value: false },
};

export default function SplitModal({ onClose, onConfirm }:{
  onClose: () => void,
  onConfirm: (data: SplitData)=>void
}) {
  const { setValue, formRepresentation, validate } = useForm(initFormState);
  const { trans } = useTranslation();

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
            url={PRODUCT_STATUSES_PATH.replace(':id', '')}
            label={trans('status')}
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
