import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import useTranslation from '../../../hooks/useTranslation';
import { Product } from '../../../utils/axios';

function Products({ products = [] }: { products: Product[], }) {
  const { trans } = useTranslation();

  return (
    <Card sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 1050 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {trans('id')}
              </TableCell>
              <TableCell>
                {trans('sku')}
              </TableCell>
              <TableCell>
                {trans('name')}
              </TableCell>
              <TableCell>
                {trans('type')}
              </TableCell>
              <TableCell>
                {trans('stock')}
              </TableCell>
              <TableCell>
                {trans('retailUnitPrice')}
              </TableCell>
              <TableCell>
                {trans('saleUnitPrice')}
              </TableCell>
              <TableCell>
                {trans('saleQuantity')}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product: Product) => (
              <TableRow
                sx={{
                  height: 60,
                }}
                hover
                key={product.id}
              >
                <TableCell>
                  {product.id}
                </TableCell>
                <TableCell>
                  {product.name}
                </TableCell>
                <TableCell>
                  {product.representative}
                </TableCell>
                <TableCell>
                  {product.email}
                </TableCell>
                <TableCell>
                  {Boolean(product.is_partner)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => {}}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

export default Products;
