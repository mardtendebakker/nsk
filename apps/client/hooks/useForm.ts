import { useEffect, useState } from 'react';

const getError = (field: Field, data: FormData): string | undefined => {
  switch (true) {
    case field.required && !field.value:
      return field.requiredMessage || 'required field';
    case typeof field.validator === 'function':
      return field.validator(data);
    default:
      return undefined;
  }
};

const useForm = (formData: FormData) : {
  formData: FormData,
  setValue: (payload: FieldPayload) => void,
  setError: (payload: FieldErrorPayload) => void,
  validate: () => boolean,
} => {
  const [data, setData] = useState<FormData>(formData);

  useEffect(() => {
    if (formData) {
      setData(formData);
    }
  }, [formData]);

  return {
    formData: data,
    setValue: ({ field, value }: FieldPayload): void => {
      setData((oldData: FormData) => ({
        ...oldData,
        [field]: {
          ...data[field],
          value,
        },
      }));
    },
    setError: ({ field, error }: FieldErrorPayload) :void => {
      setData((oldData: FormData) => ({
        ...oldData,
        [field]: {
          ...data[field],
          error,
        },
      }));
    },
    validate: () : boolean => {
      let hasError = false;

      Object.keys(data).forEach((key) => {
        const error = getError(data[key], data);
        if (error) {
          hasError = true;
        }

        setData((oldData: FormData) => ({
          ...oldData,
          [key]: {
            ...data[key],
            error,
          },
        }));
      });

      return hasError;
    },
  };
};

export default useForm;

interface Field {
  value: string | number;
  validator?: (formData: FormData) => string | undefined | null;
  required?: boolean;
  requiredMessage?: string;
  error?: string;
}

interface FormData {
  [key: string]: Field;
}

interface FieldPayload {
  field: string;
  value: string | number;
}

interface FieldErrorPayload {
  field: string;
  error: string;
}
