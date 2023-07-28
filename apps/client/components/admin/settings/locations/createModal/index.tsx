import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import Form from '../form';
import { LOCATIONS_PATH } from '../../../../../utils/axios';
import { Location } from '../../../../../utils/axios/models/location';
import ConfirmationDialog from '../../../../confirmationDialog';

export function initFormState(location?: Location) {
  return {
    name: { value: location?.name, required: true },
    zipcodes: { value: location?.zipcodes?.split(',') },
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  let zipcodes = null;

  if (formRepresentation.zipcodes.value && formRepresentation.zipcodes.value.length > 0) {
    zipcodes = formRepresentation.zipcodes.value.join(',');
  }

  return {
    name: formRepresentation.name.value,
    zipcodes,
  };
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', LOCATIONS_PATH.replace(':id', ''));

  const handleSave = () => {
    if (validate()) {
      return;
    }

    call({ body: formRepresentationToBody(formRepresentation) })
      .then(onSubmit);
  };

  return (
    <ConfirmationDialog
      open
      title={<>{trans('createLocation')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={performing}
      content={(
        <Form setValue={setValue} formRepresentation={formRepresentation} disabled={performing} />
      )}
    />
  );
}
