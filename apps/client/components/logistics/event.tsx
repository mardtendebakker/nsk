import { Box, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Order, PickupListItem } from '../../utils/axios/models/pickup';
import useTranslation from '../../hooks/useTranslation';

export default function Event({
  pickup, top, height, onClick, left, width,
}: {
  pickup: PickupListItem,
  top: string,
  height: string,
  left: number | string,
  width: string,
  onClick: () => void,
}) {
  const { trans } = useTranslation();
  const formatPickupName = (order: Order) => order?.products[0]?.name || trans('pickup');

  let title = '';

  if (pickup.real_pickup_date) {
    const realPickupDate = new Date(pickup.real_pickup_date);
    title = format(realPickupDate, 'HH:mm');
  }

  const color = pickup?.order?.order_status?.color;
  const body = formatPickupName(pickup.order);
  const username = pickup.logistic?.username || '';

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: pickup.logistic ? 'pointer' : 'not-allowed',
        top,
        height,
        bgcolor: 'white',
        position: 'absolute',
        left,
        width,
        right: 0,
        overflow: 'hidden',
        zIndex: 1,
        border: '.1rem solid white',
        borderRadius: '.2rem',
      }}
    >
      <Tooltip title={(
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span>{title}</span>
          <span>{body}</span>
          <span>{username}</span>
        </Box>
      )}
      >
        <Box sx={{
          borderBottom: `.1rem solid ${color}`,
          borderTop: `.3rem solid ${color}`,
          bgcolor: `${color}25`,
          width: '100%',
          height: '100%',
          padding: '.5rem',
          position: 'relative',
        }}
        >
          <Typography variant="inherit">
            {body}
            {', '}
            {title}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}
