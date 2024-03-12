import { Box, Card, CardContent } from '@mui/material';
import Menu from './menu';

export default function ModulesContainer({ children }: { children: JSX.Element }) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex' }}>
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
