import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import Form from '../form';
import { PRODUCT_TYPES_PATH } from '../../../../../utils/axios';
import { ProductType } from '../../../../../utils/axios/models/product';
import ConfirmationDialog from '../../../../confirmationDialog';

export function initFormState(productType?: ProductType) {
  return {
    name: { value: productType?.name, required: true },
    comment: { value: productType?.comment },
    tasks: { value: productType?.tasks?.map(({ id }) => id) || [] },
    attributes: { value: productType?.attributes?.map(({ id }) => id) || [] },
    is_attribute: { value: false },
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

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', PRODUCT_TYPES_PATH.replace(':id', ''));

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
      title={<>{trans('createProductType')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={performing}
      content={(
        <Form setValue={setValue} formRepresentation={formRepresentation} disabled={performing} />
      )}
    />
  );
}
