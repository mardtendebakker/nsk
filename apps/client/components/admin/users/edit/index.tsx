import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import useTranslation from '../../../../hooks/useTranslation';
import ConfirmationDialog from '../../../confirmationDialog';
import { USERS_PATH } from '../../../../utils/axios';
import useAxios from '../../../../hooks/useAxios';
import { Groups, UserListItem } from '../../../../utils/axios/models/user';

export default function Edit({ user, onClose, onConfirm }: { user: UserListItem, onClose: () => void, onConfirm: () => void }) {
  const { trans } = useTranslation();
  const { call, performing } = useAxios('patch', USERS_PATH.replace(':id', user.id.toString()), { withProgressBar: true, showSuccessMessage: true });
  const [selectedOptions, setSelectedOptions] = useState<{ id: string, label: string }[]>([]);

  useEffect(() => {
    setSelectedOptions(
      user.groups.map((group: string) => ({ id: group, label: group })),
    );
  }, []);

  const options = Groups.map((group) => ({ id: group, label: group }));

  const handleSubmit = () => {
    call({ body: { groups: selectedOptions.map(({ id }) => id) } }).then(onConfirm);
  };

  return (
    <ConfirmationDialog
      open
      disabled={performing}
      title={<>{trans('editUser')}</>}
      onClose={onClose}
      onConfirm={handleSubmit}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Autocomplete
            multiple
            options={options}
            disabled={performing}
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
