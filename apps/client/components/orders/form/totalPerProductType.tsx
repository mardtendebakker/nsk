import {
  Grid, Table, TableBody, TableCell, TableRow, Typography,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation } from '../../../hooks/useForm';

export default function TotalPerProductType({ formRepresentation }: { formRepresentation : FormRepresentation }) {
  const { trans } = useTranslation();

  const totalPerProductType = formRepresentation.totalPerProductType.value || {};
  const productsType = Object.keys(totalPerProductType);

  return (
    <>
      <Typography
        sx={{ mb: '1rem' }}
        variant="h4"
      >
        {trans('totalPerProductType')}
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid item>
          <Table size="small">
            <TableBody>
              {productsType.map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>
                    {totalPerProductType[key]}
                    x
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </>
  );
}
