import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import Form from '../form';
import { ATTRIBUTES_PATH } from '../../../../../utils/axios';
import { Attribute } from '../../../../../utils/axios/models/product';
import ConfirmationDialog from '../../../../confirmationDialog';

export function initFormState(attribute?: Attribute) {
  const state = {
    id: { value: attribute?.id },
    code: { value: attribute?.attr_code, required: true },
    name: { value: attribute?.name, required: true },
    type: { value: attribute?.type || 0 },
    isPublic: { value: attribute?.is_public || false },
    productTypes: { value: attribute?.productTypes?.map(({ id }) => id) || [] },
    productTypeId: { value: attribute?.product_type_id },
    price: { value: attribute?.price },
  };

  attribute?.options?.forEach((option) => {
    state[`option:${option.id}`] = { value: option };
  });

  return state;
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  const body: any = {
    attr_code: formRepresentation.code.value || undefined,
    name: formRepresentation.name.value || undefined,
    type: formRepresentation.type.value,
    is_public: formRepresentation.isPublic.value,
    productTypes: formRepresentation.productTypes.value,
    options: [],
  };

  switch (formRepresentation.type.value) {
    case 1:
      Object.keys(formRepresentation).forEach((field) => {
        if (field.includes('option:')) {
          const [, id] = field.split(':');
          body.options.push({
            id: id.includes('new') ? undefined : id,
            name: formRepresentation[field].value.name,
            price: parseInt(formRepresentation[field].value.price || 0, 10),
          });
        }
      });
      break;
    case 3:
      body.product_type_id = formRepresentation.productTypeId.value;
      break;
    default:
      body.price = parseInt(formRepresentation.price.value || 0, 10);
      break;
  }

  return body;
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const {
    formRepresentation, setValue, validate, setData,
  } = useForm(formState);

  const { call, performing } = useAxios('post', ATTRIBUTES_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });

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
      title={<>{trans('createAttribute')}</>}
      onClose={onClose}
      onConfirm={handleSave}
      disabled={performing}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Form setData={setData} setValue={setValue} formRepresentation={formRepresentation} disabled={performing} />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      )}
    />
  );
}
