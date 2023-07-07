import { Box, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { Order, PickupListItem } from '../../utils/axios/models/pickup';
import useTranslation from '../../hooks/useTranslation';

export default function Event({
  pickup, top, height, onClick,
}: {
  pickup: PickupListItem,
  top: string,
  height: string,
  onClick: () => void,
}) {
  const { trans } = useTranslation();
  const formatPickupName = (order: Order) => order?.products[0]?.name || trans('pickup');

  let title = '';

  if (pickup.real_pickup_date) {
    const realPickupDate = moment(pickup.real_pickup_date);
    title = `${realPickupDate.format('hh:mm')} - ${realPickupDate.add(1, 'hours').format('hh:mm')}`;
  }

  const color = pickup?.order?.order_status?.color;
  const body = formatPickupName(pickup.order);
  const username = pickup.logistic?.username || '';

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
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
        <Typography variant="body2" fontWeight={700}>{body}</Typography>
        {username && (
        <Box sx={{
          width: '1.2rem',
          height: '1.2rem',
          borderRadius: '50%',
          bgcolor: 'white',
          textAlign: 'center',
          position: 'absolute',
          right: '.5rem',
          bottom: '.5rem',
        }}
        >
          <Tooltip title={<Typography>{username}</Typography>}>
            <Typography variant="h5">{username.charAt(0)?.toUpperCase()}</Typography>
          </Tooltip>
        </Box>
        )}
      </Box>
    </Box>
  );
}
