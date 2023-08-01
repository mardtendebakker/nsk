import { useEffect, useMemo } from 'react';
import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm from '../../../../../hooks/useForm';
import Form from '../form';
import { TASKS_PATH } from '../../../../../utils/axios';
import { initFormState, formRepresentationToBody } from '../createModal';
import ConfirmationDialog from '../../../../confirmationDialog';

export default function EditModal({ onClose, onSubmit, id }: {
  onClose: () => void,
  onSubmit: () => void,
  id: string,
}) {
  const { trans } = useTranslation();

  const { data: task, call, performing } = useAxios('get', TASKS_PATH.replace(':id', id));
  const { call: callPut, performing: performingPut } = useAxios('put', TASKS_PATH.replace(':id', id));
  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(task), [task]));

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const canSubmit = () => !performing && !performingPut;

  const handleSave = () => {
    if (validate() && !canSubmit()) {
      return;
    }

    callPut({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('editTask')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={performing}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Form setValue={setValue} formRepresentation={formRepresentation} disabled={performing} />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      )}
    />
  );
}
