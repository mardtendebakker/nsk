import { Box, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { LogisticServiceListItem } from '../../utils/axios/models/logistic';
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

  let title = '';

  if (logisticService.event_date) {
    const realLogisticServiceDate = new Date(logisticService.event_date);
    title = format(realLogisticServiceDate, 'HH:mm');
  }

  const color = logisticService?.order?.order_status?.color;
  const body = logisticService.event_title || trans(type);
  const username = `${logisticService.driver?.first_name || ''} ${logisticService.driver?.last_name || ''}`;

  return (
    <Box
      data-testid="event"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
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
          <span>
            {trans('orderNumber')}
            {': '}
            {logisticService.order.order_nr}
          </span>
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
