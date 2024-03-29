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

export default function DueToday() {
  const { trans } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: '2rem' }}>
          {trans('dueToday')}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                {trans('taskName')}
              </TableCell>
              <TableCell>
                {trans('productName/type')}
              </TableCell>
              <TableCell>
                {trans('dueBy')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody />
        </Table>
      </CardContent>
    </Card>
  );
}
