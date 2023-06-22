import { MuiChipsInput } from 'mui-chips-input';

export default function ChipsInput({
  value,
  onChange,
  label,
  placeholder,
  fullWidth,
}:{
  value: string[],
  onChange: (value:string[]) => void,
  label: string,
  placeholder: string,
  fullWidth: boolean
}) {
  return (
    <MuiChipsInput
      fullWidth={fullWidth}
      size="small"
      value={value}
      label={label}
      placeholder={placeholder}
      onChange={onChange}
      sx={{
        legend: { display: 'none' },
      }}
      InputLabelProps={{
        shrink: true,
        sx: { transform: 'unset', position: 'relative', mb: '.5rem' },
      }}
    />
  );
}
