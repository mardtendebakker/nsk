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

export default function LocationCapacity() {
  const { trans } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: '2rem' }}>
          {trans('locationCapacity')}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                {trans('locationName')}
              </TableCell>
              <TableCell>
                {trans('status')}
              </TableCell>
              <TableCell>
                {trans('quantity')}
              </TableCell>
              <TableCell>
                {trans('lastOrder')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody />
        </Table>
      </CardContent>
    </Card>
  );
}
