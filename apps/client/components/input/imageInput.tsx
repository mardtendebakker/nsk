import { Box, SxProps, Typography } from '@mui/material';
import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Close from '@mui/icons-material/Close';

export default function ImageInput({
  image,
  onChange,
  onClear,
  sx,
  disabled = false,
  errorMessage = undefined,
  placeholder = (hovered: boolean) => <Add sx={{ fontSize: '2rem', color: image || hovered ? 'white' : 'black' }} />,
  accept = 'image/jpg,image/png,image/jpeg',
}: {
  image?: string | File,
  onChange: (arg0: File) => void,
  onClear?: () => void,
  sx?: SxProps,
  disabled?: boolean,
  errorMessage?: string,
  placeholder?: (hovered: boolean) => JSX.Element
  accept?: string
}) {
  const ref = useRef<HTMLInputElement>();
  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    if (typeof image == 'string') {
      setPreview(image);
    } else if (image instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result.toString());
      };

      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleChange = (e: ChangeEvent) => {
    if (disabled) {
      return;
    }

    const file = (e.target as HTMLInputElement).files[0];

    if (file) {
      onChange(file);
    }
  };

  const handleClear = () => {
    if (disabled) {
      return;
    }
    setPreview(undefined);
    onClear();
  };

  const id = Math.random().toString().split('.')[1];

  return (
    <Box sx={{
      p: '.5rem',
      border: (theme) => `1px solid ${theme.palette.divider}`,
      width: '100%',
      height: '14rem',
      borderRadius: '.5rem',
      boxShadow: hovered ? 'inset 0 0 0 100rem rgba(0,0,0,.4)' : undefined,
      transition: 'all .3s',
      position: 'relative',
      ...sx,
    }}
    >
      {image && (
      <Close
        onClick={handleClear}
        sx={{
          cursor: 'pointer',
          fontSize: '1.8rem',
          bgcolor: (theme) => theme.palette.primary.dark,
          color: 'white',
          borderRadius: '.5rem',
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      />
      )}
      <label htmlFor={`image-input-${id}`}>
        <input
          ref={ref}
          type="file"
          accept={accept}
          hidden
          id={`image-input-${id}`}
          onChange={handleChange}
        />
        <Box
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          sx={{
            mb: '.5rem',
            borderRadius: '.5rem',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundImage: preview && `url("${preview}")`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {!image && placeholder(hovered)}
          {hovered && image && <Edit sx={{ fontSize: '2rem', color: 'white' }} />}
        </Box>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </label>
    </Box>
  );
}
