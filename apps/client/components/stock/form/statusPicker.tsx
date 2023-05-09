import {
  FormControl, FormControlLabel, FormLabel, Radio, RadioGroup,
} from '@mui/material';
import { memo } from 'react';
import useTranslation from '../../../hooks/useTranslation';

function StatusPicker() {
  const { trans } = useTranslation();

  return (
    <FormControl>
      <FormLabel>{trans('purchaseOrderStatus')}</FormLabel>
      <RadioGroup row>
        {
        [
          {
            label: trans('deliveredOnLocation'),
            value: '1',
          },
          {
            label: trans('pending'),
            value: '2',
          },
          {
            label: trans('label'),
            value: '3',
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
  StatusPicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
