import { Box, Card, CardContent } from '@mui/material';
import Menu from './menu';
import useResponsive from '../../../hooks/useResponsive';

export default function SettingsContainer({ children }: { children: JSX.Element }) {
  const isDesktop = useResponsive('up', 'md');

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: isDesktop ? undefined : 'column' }}>
        <Box sx={{ flex: 0.15, mr: '4rem' }}>
          <Menu />
        </Box>
        <Box sx={{ flex: 0.85 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
