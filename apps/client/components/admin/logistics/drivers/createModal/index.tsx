import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import Form from '../form';
import { DRIVERS_PATH } from '../../../../../utils/axios';
import { Driver } from '../../../../../utils/axios/models/logistic';
import ConfirmationDialog from '../../../../confirmationDialog';

export function initFormState(driver?: Driver) {
  return {
    id: { value: driver?.id },
    first_name: { value: driver?.first_name, required: true },
    last_name: { value: driver?.last_name, required: true },
    email: { value: driver?.email, required: true },
    username: { value: driver?.username, required: true },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  return {
    first_name: formRepresentation.first_name.value,
    last_name: formRepresentation.last_name.value,
    email: formRepresentation.email.value,
    username: formRepresentation.username.value,
  };
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', DRIVERS_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });

  const handleSave = () => {
    if (validate() || performing) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('createDriver')}</>}
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
