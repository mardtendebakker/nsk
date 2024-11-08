import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import Autocomplete from '../../memoizedInput/autocomplete';
import { Attribute, AttributeOption } from '../../../utils/axios/models/product';
import TextField from '../../input/textField';
import { price } from '../../../utils/formatter';

function AutocompleteAttribute({
  value, onChange, attribute, disabled = false,
}
: {
  attribute: Attribute,
  value: number | undefined,
  onChange: (arg0: AttributeOption | undefined) => void,
  disabled?: boolean
}) {
  const selectedOption = attribute.options.find((option: AttributeOption) => option.id == value) || null;

  return (
    <Box sx={{ flex: '0 33%', pb: '.5rem', pr: '.5rem' }}>
      <Autocomplete
        disabled={disabled}
        value={selectedOption}
        getOptionLabel={({ name }: { name: string }) => name}
        size="small"
        sx={{ mb: '.5rem' }}
        options={attribute.options}
        onChange={(_, element: AttributeOption | undefined) => {
          onChange(element);
        }}
        filterSelectedOptions
        renderInput={
            (params) => (
              <TextField
                label={attribute.name}
                {...params}
              />
            )
        }
      />
      {selectedOption?.price && (
      <Typography color="primary" fontWeight="medium">
          {selectedOption?.price && price(selectedOption?.price)}
      </Typography>
      )}
    </Box>
  );
}

export default memo(
  AutocompleteAttribute,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
