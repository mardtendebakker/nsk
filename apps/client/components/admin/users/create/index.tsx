import { useMemo } from 'react';
import { User } from '../../../../utils/axios/models/user';
import useTranslation from '../../../../hooks/useTranslation';
import useForm from '../../../../hooks/useForm';
import Form from '../userForm';
import ConfirmationDialog from '../../../confirmationDialog';

function makeFormRepresentation(user: User) {
  return {};
}

export default function Create({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { trans } = useTranslation();
  const {
    formRepresentation,
    setValue,
  } = useForm(useMemo(makeFormRepresentation.bind(null, {}), []));

  return (
    <ConfirmationDialog
      open={open}
      title={<>{trans('createUser')}</>}
      onClose={onClose}
      onConfirm={onClose}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <Form setValue={setValue} formRepresentation={formRepresentation} />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      )}
    />
  );
}
