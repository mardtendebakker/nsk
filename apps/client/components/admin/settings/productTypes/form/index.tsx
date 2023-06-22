import { Box, Checkbox, Typography } from '@mui/material';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import DataSourcePicker from '../../../../memoizedInput/dataSourcePicker';
import { TASKS_PATH, ATTRIBUTES_PATH } from '../../../../../utils/axios';

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
        sx={{ mb: '2rem' }}
        fullWidth
        label={trans('productTypeForm.name.label')}
        placeholder={trans('productTypeForm.name.placeholder')}
        value={formRepresentation.name.value || ''}
        helperText={formRepresentation.name.error}
        error={!!formRepresentation.name.error}
        onChange={(e) => setValue({ field: 'name', value: e.target.value })}
        disabled={disabled}
      />
      <TextField
        multiline
        sx={{ mb: '2rem' }}
        minRows={3}
        fullWidth
        label={trans('productTypeForm.comment.label')}
        placeholder={trans('productTypeForm.comment.placeholder')}
        value={formRepresentation.comment.value || ''}
        helperText={formRepresentation.comment.error}
        error={!!formRepresentation.comment.error}
        onChange={(e) => setValue({ field: 'comment', value: e.target.value })}
        disabled={disabled}
      />
      <DataSourcePicker
        multiple
        sx={{ mb: '2rem' }}
        disabled={disabled}
        url={TASKS_PATH.replace(':id', '')}
        fullWidth
        label={trans('productTypeForm.tasks.label')}
        placeholder={trans('productTypeForm.tasks.placeholder')}
        onChange={(value: { id: number }[]) => {
          setValue({ field: 'tasks', value: value.map(({ id }) => id) });
        }}
        value={formRepresentation.tasks.value}
      />
      <DataSourcePicker
        multiple
        sx={{ mb: '2rem' }}
        disabled={disabled}
        url={ATTRIBUTES_PATH.replace(':id', '')}
        fullWidth
        label={trans('productTypeForm.attributes.label')}
        placeholder={trans('productTypeForm.attributes.placeholder')}
        onChange={(value: { id: number }[]) => {
          setValue({ field: 'attributes', value: value.map(({ id }) => id) });
        }}
        value={formRepresentation.attributes.value}
      />
      <Box sx={{ flex: 0.33, display: 'flex', alignItems: 'center' }}>
        <Checkbox
          sx={{ alignSelf: 'end' }}
          onChange={(_, checked) => setValue({ field: 'is_attribute', value: checked })}
          checked={formRepresentation.is_attribute.value as boolean}
        />
        <Typography variant="inherit">
          {trans('productTypeForm.isAttribute.label')}
        </Typography>
      </Box>
    </BorderedBox>
  );
}

Form.defaultProps = { disabled: false };
