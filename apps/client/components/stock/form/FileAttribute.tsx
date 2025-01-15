import {
  Box, Typography,
} from '@mui/material';
import { memo } from 'react';
import { Attribute } from '../../../utils/axios/models/product';
import ImageInput from '../../input/imageInput';
import { AFile } from '../../../utils/axios/models/aFile';
import { buildAFileLink } from '../../../utils/afile';

function buildImageLink(id: string, afile: AFile[]): string {
  const file = afile.find(({ id: afileId }) => afileId.toString() == id);
  return buildAFileLink(file);
}

function FileAttribute({
  attribute,
  value,
  afile,
  onChange,
  disabled = false,
}: {
  attribute: Attribute,
  value: (string | File)[],
  afile: AFile[],
  onChange: (arg0: (string | File)[]) => void,
  disabled?: boolean
}) {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', flex: '0 30%', m: '.5rem',
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
            sx={{ mr: (i + 1) % 3 !== 0 && '.5rem' }}
            image={image instanceof File ? image : buildImageLink(image, afile)}
            onChange={(file: File) => onChange([...value.filter((element) => element != image), file])}
            onClear={() => onChange(value.filter((element) => element != image))}
            disabled={disabled}
          />
        ))
        }
        <ImageInput
          image={undefined}
          onChange={(file: File) => onChange([...value, file])}
          onClear={() => {}}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
}

export default memo(
  FileAttribute,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
