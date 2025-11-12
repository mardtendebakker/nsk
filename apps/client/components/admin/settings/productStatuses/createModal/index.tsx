import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../../../hooks/useForm';
import Form from '../form';
import { PRODUCT_STATUSES_PATH } from '../../../../../utils/axios';
import { ProductStatus } from '../../../../../utils/axios/models/product';
import ConfirmationDialog from '../../../../confirmationDialog';

const LANGUAGES = ['en', 'nl', 'de', 'fr', 'es', 'pt', 'ar', 'fa'];

export function initFormState(productStatus?: ProductStatus) {
  const translations = productStatus?.translations as Record<string, string> | null | undefined;
  const formState: Record<string, { value: string | boolean | null | undefined; required?: boolean; error?: string }> = {
    name: { value: productStatus?.name, required: true },
    color: { value: productStatus?.color },
    isStock: { value: productStatus?.is_stock || false },
    isSaleable: { value: productStatus?.is_saleable || false },
  };

  LANGUAGES.forEach((lang) => {
    formState[`translation_${lang}`] = { value: translations?.[lang] || '' };
  });

  return formState;
}

export function formRepresentationToBody(formRepresentation: FormRepresentation) {
  const translations: Record<string, string> = {};

  LANGUAGES.forEach((lang) => {
    const value = formRepresentation[`translation_${lang}`]?.value as string;
    if (value && value.trim()) {
      translations[lang] = value.trim();
    }
  });

  return {
    name: formRepresentation.name.value,
    color: formRepresentation.color.value,
    is_stock: formRepresentation.isStock.value,
    is_saleable: formRepresentation.isSaleable.value,
    translations: Object.keys(translations).length > 0 ? translations : null,
  };
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: () => void,
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);

  const { call, performing } = useAxios('post', PRODUCT_STATUSES_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });

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
      title={<>{trans('createProductStatus')}</>}
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
