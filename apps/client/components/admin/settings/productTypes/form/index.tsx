import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import DataSourcePicker from '../../../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_ATTRIBUTES_PATH, AUTOCOMPLETE_TASKS_PATH } from '../../../../../utils/axios';
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
        sx={{ mb: '1rem' }}
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
        sx={{ mb: '1rem' }}
        disabled={disabled}
        searchKey="name"
        url={AUTOCOMPLETE_TASKS_PATH}
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
        sx={{ mb: '.5rem' }}
        disabled={disabled}
        url={AUTOCOMPLETE_ATTRIBUTES_PATH}
        searchKey="name"
        fullWidth
        label={trans('productTypeForm.attributes.label')}
        placeholder={trans('productTypeForm.attributes.placeholder')}
        onChange={(value: { id: number }[]) => {
          setValue({ field: 'attributes', value: value.map(({ id }) => id) });
        }}
        value={formRepresentation.attributes.value}
      />
      <Checkbox
        onCheck={(checked) => setValue({ field: 'is_attribute', value: checked })}
        label={trans('productTypeForm.isAttribute.label')}
        checked={formRepresentation.is_attribute.value as boolean}
      />

      <Checkbox
        onCheck={(checked) => setValue({ field: 'is_public', value: checked })}
        label={trans('productTypeForm.isPublic.label')}
        checked={formRepresentation.is_public.value as boolean}
      />
    </BorderedBox>
  );
}

Form.defaultProps = { disabled: false };
