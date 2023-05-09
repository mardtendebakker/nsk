import {
  FormControl, FormControlLabel, FormLabel, Radio, RadioGroup,
} from '@mui/material';
import { memo } from 'react';
import useTranslation from '../../../hooks/useTranslation';

function SupplierTypePicker() {
  const { trans } = useTranslation();

  return (
    <FormControl>
      <FormLabel>{trans('supplierType')}</FormLabel>
      <RadioGroup row>
        {
        [
          {
            label: trans('existing'),
            value: '1',
          },
          {
            label: trans('new'),
            value: '2',
          },
        ].map(({ label, value }, i) => (
          <FormControlLabel
            key={value}
            sx={(theme) => ({
              border: `2px solid ${theme.palette.text.disabled}`,
              borderRadius: '.5rem',
              p: '.25rem .5rem',
              ml: i === 0 ? 'unset' : '1.5rem',
            })}
            value={value}
            labelPlacement="start"
            control={<Radio />}
            label={label}
          />
        ))
        }
      </RadioGroup>
    </FormControl>
  );
}

export default memo(
  SupplierTypePicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
