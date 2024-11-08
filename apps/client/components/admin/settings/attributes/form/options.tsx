import { Button, Grid, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BaseTextField from '../../../../input/textField';
import Delete from '../../../../button/delete';

export default function Options({
  setValue,
  setData,
  formRepresentation,
  disabled = false,
}: {
  setValue: SetValue,
  setData: (arg0: FormRepresentation) => void,
  formRepresentation: FormRepresentation
  disabled?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Typography sx={{ mb: '.8rem' }}>{trans('attributeOptions')}</Typography>
      {Object.keys(formRepresentation)
        .filter((key) => key.includes('option:'))
        .map((field) => (
          <Grid sx={{ flex: 1, mb: '2rem', display: 'flex' }} item key={field}>
            <BaseTextField
              sx={{ flex: 0.6, mr: '1rem' }}
              value={formRepresentation[field].value.name}
              placeholder={trans('attributeForm.optionName.placeholder')}
              onChange={(e) => {
                setValue({
                  field,
                  value: {
                    name: e.target.value,
                    price: formRepresentation[field].value.price,
                  },
                });
              }}
            />
            <BaseTextField
              sx={{ flex: 0.4, mr: '1rem' }}
              type="number"
              value={formRepresentation[field].value.price}
              placeholder="0.00"
              onChange={(e) => {
                setValue({
                  field,
                  value: {
                    name: formRepresentation[field].value.name,
                    price: Math.max(0, parseInt(e.target.value, 10)),
                  },
                });
              }}
            />
            <Delete
              onClick={() => {
                setData(Object.keys(formRepresentation)
                  .filter((key) => key !== field)
                  .reduce((obj, key) => {
                    obj[key] = formRepresentation[key];
                    return obj;
                  }, {}));
              }}
              disabled={disabled}
              tooltip
            />
          </Grid>
        ))}
      <Button
        size="small"
        onClick={() => {
          setData({
            ...formRepresentation,
            [`option:new_${Math.random()}`]: { value: { name: '', price: 0 } },
          });
        }}
      >
        <Add />
        {trans('addAnother')}
      </Button>
    </>
  );
}
