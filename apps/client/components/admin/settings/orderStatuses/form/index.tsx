import { Box } from '@mui/material';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import Checkbox from '../../../../checkbox';

export default function Form({
  setValue,
  formRepresentation,
  disabled,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation
  disabled?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <BorderedBox sx={{ width: '80rem', p: '1rem' }}>
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('orderStatusForm.name.label')}
        placeholder={trans('orderStatusForm.name.placeholder')}
        value={formRepresentation.name.value || ''}
        helperText={formRepresentation.name.error}
        error={!!formRepresentation.name.error}
        onChange={(e) => setValue({ field: 'name', value: e.target.value })}
        disabled={disabled}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: '1rem' }}>
        <input
          onChange={(e) => setValue({ field: 'color', value: e.target.value })}
          type="color"
          style={{ width: '10rem' }}
          value={formRepresentation.color.value || '#ffffff'}
        />
        <Checkbox
          disabled={disabled}
          onCheck={(checked) => setValue({ field: 'isPurchase', value: checked })}
          checked={formRepresentation.isPurchase.value as boolean}
          label={trans('isPurchase')}
        />
        <Checkbox
          disabled={disabled}
          onCheck={(checked) => setValue({ field: 'isSale', value: checked })}
          checked={formRepresentation.isSale.value as boolean}
          label={trans('isSale')}
        />
        <Checkbox
          disabled={disabled}
          onCheck={(checked) => setValue({ field: 'isRepair', value: checked })}
          checked={formRepresentation.isRepair.value as boolean}
          label={trans('isRepair')}
        />
      </Box>
      <TextField
        minRows={3}
        multiline
        fullWidth
        label={trans('orderStatusForm.mailBody.label')}
        placeholder={trans('orderStatusForm.mailBody.placeholder')}
        value={formRepresentation.mailBody.value || ''}
        helperText={formRepresentation.mailBody.error}
        error={!!formRepresentation.mailBody.error}
        onChange={(e) => setValue({ field: 'mailBody', value: e.target.value })}
        disabled={disabled}
      />
    </BorderedBox>
  );
}

Form.defaultProps = { disabled: false };
