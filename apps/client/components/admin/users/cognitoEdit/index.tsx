import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import useTranslation from '../../../../hooks/useTranslation';
import ConfirmationDialog from '../../../confirmationDialog';
import { ADMIN_USERS_GROUPS } from '../../../../utils/axios';
import useAxios from '../../../../hooks/useAxios';
import { CognitoGroup } from '../../../../utils/axios/models/user';

export default function Edit({ username, onClose, onConfirm }: { username: string, onClose: () => void, onConfirm: () => void }) {
  const { trans } = useTranslation();
  const { call, data = [], performing } = useAxios<undefined | CognitoGroup[]>('get', ADMIN_USERS_GROUPS.replace(':username', username), { withProgressBar: true });
  const { call: callPut, performing: performingPut } = useAxios('put', ADMIN_USERS_GROUPS.replace(':username', username), { withProgressBar: true, showSuccessMessage: true });
  const [selectedOptions, setSelectedOptions] = useState<{ id: string, label: string }[]>([]);

  useEffect(() => {
    call().catch(() => {});
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setSelectedOptions(
        data.filter(({ assign }) => assign).map(({ group }) => ({ id: group, label: group })),
      );
    }
  }, [data]);

  const options = data.map(({ group }) => ({ id: group, label: group }));

  const handleSubmit = () => {
    callPut({
      body: data.map(({ group }) => ({ group, assign: !!selectedOptions.find((element) => element.id == group) })),
    }).then(onConfirm);
  };

  const disabled = performing || performingPut || data.length == 0;

  return (
    <ConfirmationDialog
      open={!!username}
      disabled={disabled}
      title={<>{trans('editUser')}</>}
      onClose={onClose}
      onConfirm={handleSubmit}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Autocomplete
            multiple
            options={options}
            disabled={disabled}
            size="small"
            sx={{ width: '20rem', mt: '.5rem' }}
            onChange={(_, selected) => {
              setSelectedOptions(selected);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.label}
              </li>
            )}
            value={selectedOptions}
            renderInput={
              (inputParams) => (
                <TextField
                  {...inputParams}
                  label={trans('groups')}
                  placeholder={trans('selectGroups')}
                />
              )
}
            filterSelectedOptions
          />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      )}
    />
  );
}
