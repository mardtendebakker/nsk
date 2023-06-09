import {
  FormControl, FormControlLabel, FormLabel, Radio, RadioGroup,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';

export type SupplierType = 'existing' | 'new';

function SupplierTypePicker(
  { onChange, value }
  : { onChange: (arg0: SupplierType) => void, value: SupplierType },
) {
  const { trans } = useTranslation();

  return (
    <FormControl sx={{ flex: 1 }}>
      <FormLabel>{trans('supplierType')}</FormLabel>
      <RadioGroup
        row
        defaultValue={value}
        onChange={(e) => onChange(e.target.value as SupplierType)}
        value={value}
      >
        {
        [
          {
            label: trans('existing'),
            value: 'existing',
          },
          {
            label: trans('new'),
            value: 'new',
          },
        ].map((element: { label: string, value: SupplierType }, i) => (
          <FormControlLabel
            key={element.value}
            sx={(theme) => ({
              border: `2px solid ${theme.palette.text.disabled}`,
              borderRadius: '.5rem',
              p: '.25rem .5rem',
              mr: 0,
              ml: i === 0 ? 'unset' : '1rem',
              flex: 1,
            })}
            labelPlacement="end"
            control={<Radio value={element.value} />}
            label={element.label}
          />
        ))
        }
      </RadioGroup>
    </FormControl>
  );
}

export default SupplierTypePicker;
