import { Box, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Order, LogisticServiceListItem } from '../../utils/axios/models/logistic';
import useTranslation from '../../hooks/useTranslation';

export default function Event({
  type, logisticService, top, height, onClick, left, width,
}: {
  type: 'pickup' | 'delivery',
  logisticService: LogisticServiceListItem,
  top: string,
  height: string,
  left: number | string,
  width: string,
  onClick: () => void,
}) {
  const { trans } = useTranslation();
  const formatLogisticServiceName = (order: Order) => order?.products[0]?.name || trans(type);

  let title = '';

  if (logisticService.logistic_date) {
    const realLogisticServiceDate = new Date(logisticService.logistic_date);
    title = format(realLogisticServiceDate, 'HH:mm');
  }

  const color = logisticService?.order?.order_status?.color;
  const body = formatLogisticServiceName(logisticService.order);
  const username = logisticService.logistic?.username || '';

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: logisticService.logistic ? 'pointer' : 'not-allowed',
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
