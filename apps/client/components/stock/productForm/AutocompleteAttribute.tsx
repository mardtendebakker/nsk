import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import Autocomplete from '../../memoizedInput/autocomplete';
import { Attribute, AttributeOption } from '../../../utils/axios';
import TextField from '../../input/textField';

function AutocompleteAttribute({ value, onChange, attribute }
: {
  attribute: Attribute,
  value: number | undefined,
  onChange: (arg0: AttributeOption | undefined) => void
}) {
  const selectedOption = attribute.options.find((option: AttributeOption) => option.id == value) || null;

  return (
    <Box sx={{ flex: '0 33%', pb: '1rem', pr: '1rem' }}>
      <Autocomplete
        value={selectedOption}
        getOptionLabel={({ name }: { name: string }) => name}
        size="small"
        sx={{ mb: '1rem' }}
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
        €
          {selectedOption?.price}
      </Typography>
      )}
    </Box>
  );
}

export default memo(
  AutocompleteAttribute,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
