import {
  Box, IconButton, SxProps, Typography,
} from '@mui/material';
import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Eye from '@mui/icons-material/RemoveRedEye';
import Delete from '../button/delete';

export default function ImageInput({
  image,
  onChange,
  onClear,
  sx,
  disabled = false,
  disableEdit = false,
  errorMessage = undefined,
  placeholder = (hovered: boolean) => <Add sx={{ fontSize: '2rem', color: image || hovered ? 'white' : 'black' }} />,
  accept = 'image/jpg,image/png,image/jpeg',
}: {
  image?: string | File,
  onChange?: (arg0: File) => void,
  onClear?: () => void,
  sx?: SxProps,
  disabled?: boolean,
  disableEdit?: boolean,
  errorMessage?: string,
  placeholder?: (hovered: boolean) => JSX.Element
  accept?: string,
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
    if (disabled || (disableEdit && image)) {
      return;
    }

    const file = (e.target as HTMLInputElement).files[0];

    if (file && onChange) {
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
  const isEditDisabled = disabled || (disableEdit && image);

  return (
    <Box sx={{
      p: '.5rem',
      border: (theme) => `1px solid ${theme.palette.divider}`,
      width: '10rem',
      height: '10rem',
      borderRadius: '.5rem',
      boxShadow: hovered && onChange && !isEditDisabled ? 'inset 0 0 0 100rem rgba(0,0,0,.4)' : undefined,
      transition: 'all .3s',
      position: 'relative',
      ...sx,
    }}
    >
      {image && (
      <Delete
        sx={{
          borderRadius: '1rem',
          position: 'absolute',
          top: -10,
          right: 2,
          background: 'white',
        }}
        tooltip
        onClick={handleClear}
        disabled={disabled}
      />
      )}
      {typeof image == 'string' && (
        <IconButton
          sx={{
            borderRadius: '1rem',
            border: 0,
            position: 'absolute',
            background: 'white',
            top: -10,
            right: 32,
          }}
          onClick={() => window.open(image, '_blank')}
          size="small"
          color="primary"
          disabled={disabled}
        >
          <Eye sx={{ fontSize: '1rem' }} />
        </IconButton>
      )}
      <label htmlFor={`image-input-${id}`}>
        {onChange && !isEditDisabled && (
        <input
          ref={ref}
          type="file"
          accept={accept}
          hidden
          id={`image-input-${id}`}
          onChange={handleChange}
        />
        )}
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
            cursor: isEditDisabled ? 'default' : 'pointer',
            backgroundImage: preview && `url("${preview}")`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {onChange && !image && placeholder(hovered)}
          {onChange && hovered && image && !disableEdit && <Edit sx={{ fontSize: '2rem', color: 'white' }} />}
        </Box>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </label>
    </Box>
  );
}
