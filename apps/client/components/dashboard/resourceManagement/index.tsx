import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';

export default function ResourceManagement() {
  const { trans } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: '2rem' }}>
          {trans('ResourceManagement')}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                {trans('name')}
              </TableCell>
              <TableCell>
                {trans('email')}
              </TableCell>
              <TableCell>
                {trans('numberOfTasks')}
              </TableCell>
              <TableCell>
                {trans('status')}
              </TableCell>
              <TableCell>
                {trans('role')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody />
        </Table>
      </CardContent>
    </Card>
  );
}
