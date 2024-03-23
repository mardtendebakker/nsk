import { Box } from '@mui/material';
import useTranslation from '../../../../../hooks/useTranslation';
import { ModuleListItem } from '../../../../../utils/axios/models/module';
import ConfirmationDialog from '../../../../confirmationDialog';
import TextField from '../../../../memoizedInput/textField';
import SensitiveTextField from '../../../../memoizedInput/sensitiveTextField';
import useForm from '../../../../../hooks/useForm';

export default function SettingsModal({
  onClose, onSubmit, module, disabled,
}: {
  onClose: () => void,
  onSubmit: (config: { [key: string]: string }) => void,
  module: ModuleListItem,
  disabled: boolean
}) {
  const { trans } = useTranslation();
  const configEntries = Object.entries(module.config);
  const initState = {};

  configEntries.forEach(([key, config]) => {
    initState[key] = {
      value: config.value,
      required: config.required,
    };
  });

  const { formRepresentation, setValue, validate } = useForm(initState);

  const handleSave = () => {
    if (validate()) {
      return;
    }

    const config = {};

    configEntries.forEach(([key]) => {
      config[key] = formRepresentation[key].value;
    });

    onSubmit(config);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('settings')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={disabled}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Box sx={{ width: '20rem' }}>
            {configEntries.map(([key, config]) => {
              const Component = config.sensitive ? SensitiveTextField : TextField;

              return (
                <Component
                  key={key}
                  fullWidth
                  sx={{ mb: '.5rem' }}
                  label={trans(key)}
                  value={formRepresentation[key].value || ''}
                  placeholder={trans(key)}
                  helperText={formRepresentation[key].error}
                  error={!!formRepresentation[key].error}
                  onChange={(e) => setValue({ field: key, value: e.target.value })}
                  disabled={disabled}
                />
              );
            })}
            <input type="submit" style={{ display: 'none' }} />
          </Box>
        </form>
      )}
    />
  );
}
