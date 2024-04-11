import {
  Autocomplete,
  Chip,
  Box,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { set } from 'date-fns';
import useTranslation from '../../../../../hooks/useTranslation';
import { ModuleListItem } from '../../../../../utils/axios/models/module';
import ConfirmationDialog from '../../../../confirmationDialog';
import TextField from '../../../../memoizedInput/textField';
import SensitiveTextField from '../../../../memoizedInput/sensitiveTextField';
import useForm from '../../../../../hooks/useForm';
import BaseTextField from '../../../../input/textField';

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
              switch (config.type) {
                case 'multiSelect':
                  return (
                    <Autocomplete
                      key={key}
                      multiple
                      fullWidth
                      disabled={disabled}
                      size="small"
                      options={config.options || []}
                      renderOption={(props, option) => (
                        <li {...props} key={option}>
                          {trans(option)}
                        </li>
                      )}
                      renderTags={(tags) => tags.map((tag) => <Chip key={tag} label={trans(tag)} sx={{ mb: '.1rem', mr: '.1rem' }} />)}
                      value={formRepresentation[key].value || []}
                      onChange={(_, value: string[]) => {
                        setValue({ field: key, value: value.length < 1 ? undefined : value });
                      }}
                      filterSelectedOptions
                      renderInput={(inputParams) => (
                        <BaseTextField
                          {...inputParams}
                          placeholder={trans(key)}
                          label={trans(key)}
                          helperText={formRepresentation[key].error}
                          error={!!formRepresentation[key].error}
                        />
                      )}
                    />
                  );
                case 'hour':
                  return (
                    <TimePicker
                      key={key}
                      views={['hours']}
                      value={Number.isInteger(parseInt(formRepresentation[key].value, 10)) ? set(new Date(), { hours: formRepresentation[key].value, minutes: 0 }) : null}
                      onChange={(value) => setValue({ field: key, value: value.getHours() })}
                      renderInput={(inputParams) => (
                        <BaseTextField
                          {...inputParams}
                          fullWidth
                          placeholder={trans(key)}
                          label={trans(key)}
                          helperText={formRepresentation[key].error}
                          error={!!formRepresentation[key].error}
                        />
                      )}
                    />
                  );
                case 'password':
                  return (
                    <SensitiveTextField
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
                default:
                  return (
                    <TextField
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
              }
            })}
            <input type="submit" style={{ display: 'none' }} />
          </Box>
        </form>
      )}
    />
  );
}
