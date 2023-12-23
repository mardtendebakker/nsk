import { useEffect, useMemo } from 'react';
import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm from '../../../../../hooks/useForm';
import Form from '../form';
import { LOCATIONS_PATH } from '../../../../../utils/axios';
import { initFormState, formRepresentationToBody } from '../createModal';
import ConfirmationDialog from '../../../../confirmationDialog';
import { Location } from '../../../../../utils/axios/models/location';

export default function EditModal({ onClose, onSubmit, id }: {
  onClose: () => void,
  onSubmit: () => void,
  id: string,
}) {
  const { trans } = useTranslation();

  const { data: location, call, performing } = useAxios<Location | undefined>('get', LOCATIONS_PATH.replace(':id', id));
  const { call: callPut, performing: performingPut } = useAxios('put', LOCATIONS_PATH.replace(':id', id), { showSuccessMessage: true });
  const { formRepresentation, setValue, validate } = useForm(useMemo(() => initFormState(location), [location]));

  useEffect(() => {
    call().catch(onClose);
  }, []);

  const canSubmit = () => !performing && !performingPut;

  const handleSave = () => {
    if (validate() || !canSubmit()) {
      return;
    }

    callPut({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('editLocation')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={!canSubmit()}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Form setValue={setValue} formRepresentation={formRepresentation} disabled={!canSubmit()} />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      )}
    />
  );
}
