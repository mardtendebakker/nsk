import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import DataSourcePicker from '../../../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_PRODUCT_TYPES_PATH } from '../../../../../utils/axios';

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
        label={trans('taskForm.name.label')}
        placeholder={trans('taskForm.name.placeholder')}
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
        label={trans('taskForm.description.label')}
        placeholder={trans('taskForm.description.placeholder')}
        value={formRepresentation.description.value || ''}
        helperText={formRepresentation.description.error}
        error={!!formRepresentation.description.error}
        onChange={(e) => setValue({ field: 'description', value: e.target.value })}
        disabled={disabled}
      />
      <DataSourcePicker
        multiple
        disabled={disabled}
        path={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
        fullWidth
        label={trans('taskForm.productTypes.label')}
        placeholder={trans('taskForm.productTypes.placeholder')}
        onChange={(value: { id: number }[]) => {
          setValue({ field: 'productTypes', value: value.map(({ id }) => id) });
        }}
        value={formRepresentation.productTypes.value}
      />
    </BorderedBox>
  );
}

Form.defaultProps = { disabled: false };
