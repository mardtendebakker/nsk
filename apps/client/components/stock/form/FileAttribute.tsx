import {
  Box, Typography,
} from '@mui/material';
import { memo } from 'react';
import { Attribute } from '../../../utils/axios';
import ImageInput from '../../input/imageInput';

function FileAttribute({
  attribute,
  value,
  onChange,
  disabled,
}: {
  attribute: Attribute,
  value: (string | File)[],
  onChange: (arg0: (string | File)[]) => void,
  disabled?: boolean
}) {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', pb: '1rem', pr: '1rem', flex: '0 33%',
    }}
    >
      <Typography
        sx={{ color: (theme) => theme.palette.text.secondary, mb: '.1rem' }}
        variant="body1"
      >
        {attribute.name}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {
        value.map((image: string | File, i: number) => (
          <ImageInput
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            sx={{
              height: '7rem', flex: '0 31%', mr: (i + 1) % 3 !== 0 && '.5rem', mb: '1rem',
            }}
            image={image}
            onChange={(file: File) => onChange([...value.filter((element) => element != image), file])}
            onClear={() => onChange(value.filter((element) => element != image))}
            disabled={disabled}
          />
        ))
        }
        <ImageInput
          sx={{
            height: '7rem', flex: '0 31%', mr: '.5rem', mb: '1rem',
          }}
          image={undefined}
          onChange={(file: File) => onChange([...value, file])}
          onClear={() => {}}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
}

FileAttribute.defaultProps = { disabled: false };

export default memo(
  FileAttribute,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
