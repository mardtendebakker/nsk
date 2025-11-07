import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import useAxios from '../../../../../hooks/useAxios';
import { TEAMS_PATH } from '../../../../../utils/axios';
import ConfirmationDialog from '../../../../confirmationDialog';
import Form from '../form';
import { Team } from '../../../../../utils/axios/models/order';

export function initFormState(team?: Team) {
  return {
    name: { value: team?.name, required: true },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  const body = {};

  Object.keys(formRepresentation).forEach((key) => {
    const value = formRepresentation[key].value || null;

    body[key] = value;
  });

  return body;
}

const formState = initFormState();

export default function CreateModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', TEAMS_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });

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
      title={<>{trans('createTeam')}</>}
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
