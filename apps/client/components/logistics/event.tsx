import { Box, Tooltip, Typography } from '@mui/material';

export default function Event({
  title,
  body,
  color,
  top,
  height,
  username,
}: {
  title: string,
  body: string | undefined,
  color: string,
  top: string,
  height: string,
  username: string,
}) {
  return (
    <Box sx={{
      top,
      height,
      bgcolor: 'white',
      position: 'absolute',
      left: 0,
      right: 0,
      overflow: 'hidden',
      zIndex: 1,
    }}
    >
      <Box sx={{
        borderBottom: `.1rem solid ${color}`,
        borderTop: `.3rem solid ${color}`,
        bgcolor: `${color}25`,
        width: '100%',
        height: '100%',
        padding: '1rem',
        position: 'relative',
      }}
      >
        <Typography variant="inherit">{title}</Typography>
        <Typography variant="h4">{body}</Typography>
        {username && (
        <Box sx={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          bgcolor: 'white',
          textAlign: 'center',
          position: 'absolute',
          right: '1rem',
          bottom: '1rem',
        }}
        >
          <Tooltip title={<Typography>{username}</Typography>}>
            <Typography variant="h4">{username.charAt(0)}</Typography>
          </Tooltip>
        </Box>
        )}
      </Box>
    </Box>
  );
}
