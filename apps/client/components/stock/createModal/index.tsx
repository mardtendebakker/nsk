import { useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import useTranslation from '../../../hooks/useTranslation';
import useForm, { FormRepresentation } from '../../../hooks/useForm';
import Form from '../form';
import { AxiosResponse, STOCK_PRODUCTS_PATH } from '../../../utils/axios';
import { Product } from '../../../utils/axios/models/product';
import ConfirmationDialog from '../../confirmationDialog';
import { buildAttributeKey } from '../form/AttributeForm';

export function initFormState(product?: Product) {
  const attributes = {};

  product?.product_attributes?.forEach((productAttribute) => {
    const value = productAttribute.attribute.type == 2
      ? productAttribute.value?.split(',').filter(Boolean)
      : productAttribute.value;

    attributes[buildAttributeKey({ id: productAttribute.attribute_id }, { id: product.product_type.id })] = {
      value,
      additionalData: {
        selectedOption: productAttribute.selectedOption,
      },
    };
  });

  return {
    afile: { value: product?.afile },
    sku: { value: product?.sku },
    name: { value: product?.name, required: true },
    type_id: { value: product?.product_type?.id },
    location_id: { value: product?.location?.id, required: true },
    status_id: { value: product?.product_status?.id },
    price: { value: product?.price || 0, required: true },
    description: { value: product?.description },
    ...attributes,
  };
}

export function formRepresentationToBody(formRepresentation: FormRepresentation): FormData {
  const formData = new FormData();
  let prIndex = 0;
  const fileIds = [];

  Object.keys(formRepresentation).forEach((key) => {
    if (key == 'afile') {
      return;
    }

    const value = formRepresentation[key].value || null;

    if (key.includes('attribute:') && formRepresentation.type_id.value >= 0) {
      const splitted = key.split(':');
      if (formRepresentation.type_id.value != splitted[1]) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((subValue) => {
          if (subValue instanceof Blob) {
            formData.append(`${splitted[2]}`, subValue);
          } else {
            fileIds.push(subValue);
          }
        });
        formData.append(`product_attributes[${prIndex}][attribute_id]`, splitted[2]);
        formData.append(`product_attributes[${prIndex}][value]`, fileIds.filter(Boolean).join(','));
        prIndex += 1;
      } else {
        formData.append(`product_attributes[${prIndex}][attribute_id]`, splitted[2]);
        formData.append(`product_attributes[${prIndex}][value]`, value);
        prIndex += 1;
      }
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

const formState = initFormState();

export default function CreateModal({ onClose, onSubmit, additionalPayloadData }: {
  onClose: () => void,
  onSubmit: (product: Product) => void,
  additionalPayloadData?: { [key: string]: string }
}) {
  const { trans } = useTranslation();
  const { formRepresentation, setValue, validate } = useForm(formState);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { call, performing } = useAxios('post', STOCK_PRODUCTS_PATH.replace(':id', ''), { showSuccessMessage: true, withProgressBar: true });

  const handleSave = () => {
    if (validate()) {
      return;
    }

    const body = formRepresentationToBody(formRepresentation);

    Object.keys(additionalPayloadData).forEach((key) => {
      body.append(key, additionalPayloadData[key]);
    });

    call({ body, headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response: AxiosResponse) => {
        onSubmit(response.data);
      });
  };

  const handleSubmit = (event?: React.SyntheticEvent) => {
    event?.preventDefault();
    if (!validate()) {
      setShowConfirmation(true);
    }
  };

  return (
    <>
      <ConfirmationDialog
        open
        title={<>{trans('createProduct')}</>}
        onClose={onClose}
        onConfirm={handleSubmit}
        disabled={performing}
        content={(
          <form onSubmit={handleSubmit}>
            <Form setValue={setValue} formRepresentation={formRepresentation} disabled={performing} />
            <input type="submit" style={{ display: 'none' }} />
          </form>
      )}
      />
      <ConfirmationDialog
        open={showConfirmation}
        title={<>{trans('reminder')}</>}
        content={<span>{`${trans('productEditConfirmation')} ${formRepresentation?.price.value}`}</span>}
        onConfirm={handleSave}
        onClose={() => setShowConfirmation(false)}
      />
    </>
  );
}

CreateModal.defaultProps = { additionalPayloadData: {} };
