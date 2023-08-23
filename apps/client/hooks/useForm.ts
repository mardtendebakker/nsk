import { useEffect, useState } from 'react';
import useTranslation from './useTranslation';

export type SetValue = (payload: FieldPayload) => void;
interface ValidateResponse {
  [key: string]: string
}

const getError = (field: Field, data: FormRepresentation, trans): string | undefined => {
  switch (true) {
    case field.required && !field.value:
      return field.requiredMessage || trans('requiredField');
    case typeof field.validator === 'function':
      return field.validator(data);
    default:
      return undefined;
  }
};

const useForm = (formRepresentation: FormRepresentation) : {
  formRepresentation: FormRepresentation,
  setValue: SetValue,
  setError: (payload: FieldErrorPayload) => void,
  validate: () => undefined | ValidateResponse,
  setData: (formRepresentation: FormRepresentation) => void
} => {
  const [data, setData] = useState<FormRepresentation>(formRepresentation);
  const { trans } = useTranslation();

  useEffect(() => {
    if (formRepresentation) {
      setData(formRepresentation);
    }
  }, [JSON.stringify(formRepresentation)]);

  return {
    formRepresentation: data,
    setData,
    setValue: ({ field, value }: FieldPayload): void => {
      setData((oldData: FormRepresentation) => ({
        ...oldData,
        [field]: {
          ...data[field],
          value,
        },
      }));
    },
    setError: ({ field, error }: FieldErrorPayload) :void => {
      setData((oldData: FormRepresentation) => ({
        ...oldData,
        [field]: {
          ...data[field],
          error,
        },
      }));
    },
    validate: () : undefined | ValidateResponse => {
      const errors = {};

      Object.keys(data).forEach((key) => {
        const error = getError(data[key], data, trans);
        if (error) {
          errors[key] = error;
        }

        setData((oldData: FormRepresentation) => ({
          ...oldData,
          [key]: {
            ...data[key],
            error,
          },
        }));
      });

      return Object.keys(errors).length > 0 ? errors : undefined;
    },
  };
};

export default useForm;

export interface Field {
  value?: any;
  validator?: (formRepresentation: FormRepresentation) => string | undefined | null;
  required?: boolean;
  requiredMessage?: string;
  error?: string;
  disabled?: boolean;
}

export interface FormRepresentation {
  [key: string]: Field;
}

export interface FieldPayload {
  field: string;
  value: any;
}

interface FieldErrorPayload {
  field: string;
  error: string;
}
