import {
  Box,
  Button,
  TableBody,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import {
  useState, useEffect, useCallback,
} from 'react';
import Add from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { Product, ProductListItem } from '../../../../utils/axios/models/product';
import debounce from '../../../../utils/debounce';
import TextField from '../../../memoizedInput/textField';
import CreateModal from '../../../stock/createModal';
import useTranslation from '../../../../hooks/useTranslation';
import useAxios from '../../../../hooks/useAxios';
import { APRODUCT_PATH } from '../../../../utils/axios';
import EditModal from '../../../stock/editModal';
import Edit from '../../../button/edit';
import PaginatedTable from '../../../paginatedTable';
import TableCell from '../../../tableCell';
import can from '../../../../utils/can';
import useSecurity from '../../../../hooks/useSecurity';
import Can from '../../../can';
import Filter from '../../../stock/list/filter';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import { getQueryParam } from '../../../../utils/location';
import initFormState from '../productsInitFormState';
import refreshList from '../productsRefreshList';
import ProductsAction from '../productsAction';
import useBulkPrintChecklist from '../../../../hooks/apiCalls/useBulkPrintChecklist';
import useBulkPrintPriceCards from '../../../../hooks/apiCalls/useBulkPrintPriceCards';
import useBulkPrintLabels from '../../../../hooks/apiCalls/useBulkPrintLabels';
import useBulkPrintBarcodes from '../../../../hooks/apiCalls/useBulkPrintBarcodes';

export default function ProductsTable({ orderId }:{ orderId: string }) {
  const { state: { user } } = useSecurity();
  const router = useRouter();
  const [showForm, setShowForm] = useState<boolean>(false);
  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: getQueryParam('search'),
    productType: getQueryParam('productType'),
    location: getQueryParam('location'),
    locationLabel: getQueryParam('locationLabel'),
    productStatus: getQueryParam('productStatus'),
    orderId,
  }));

  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);

  const { trans } = useTranslation();

  const { printChecklists, performing: performingBulkPrintChecklists } = useBulkPrintChecklist({ withProgressBar: true });
  const { printPriceCards, performing: performingBulkPrintPriceCards } = useBulkPrintPriceCards({ withProgressBar: true });
  const { printLabels, performing: performingBulkPrintLabels } = useBulkPrintLabels({ withProgressBar: true });
  const { printBarcodes, performing: performingBulkPrintBarcodes } = useBulkPrintBarcodes({ withProgressBar: true });

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: ProductListItem[], count?: number }>(
    'get',
    APRODUCT_PATH.replace(':id', ''),
    {
      withProgressBar: true,
      defaultParams: {
        orderBy: JSON.stringify({ order_updated_at: 'desc' }),
      },
    },
  );

  const { call: callPut, performing: performingPut } = useAxios('put', undefined, { withProgressBar: true });

  const handleProductPropertyChange = useCallback(debounce((product: ProductListItem, property: string, value) => {
    callPut({
      path: APRODUCT_PATH.replace(':id', product.id.toString()),
      body: {
        product_orders: [
          {
            [property]: value,
            id: product.product_order.id,
          },
        ],
      },
    });
  }), []);

  const defaultRefreshList = () => refreshList({
    page,
    rowsPerPage,
    formRepresentation,
    router,
    call,
    orderId,
  });

  useEffect(() => {
    defaultRefreshList();
  }, [
    page,
    rowsPerPage,
    formRepresentation.search.value,
    formRepresentation.productType.value?.toString(),
    formRepresentation.productStatus.value?.toString(),
    formRepresentation.location.value?.toString(),
    formRepresentation.locationLabel.value?.toString(),
  ]);

  const disabled = (): boolean => performing
  || performingPut
  || performingBulkPrintChecklists
  || performingBulkPrintPriceCards
  || performingBulkPrintLabels
  || performingBulkPrintBarcodes;

  const handleReset = () => {
    setData(initFormState({ orderId }));
    setPage(1);
  };

  const handleAllChecked = (checked: boolean) => {
    setCheckedProductIds(
      checked
        ? _.union(checkedProductIds, data.map(({ id }) => id))
        : checkedProductIds.filter((productId) => !data.find((product: ProductListItem) => product.id == productId)),
    );
  };

  const handleRowChecked = ({ id, checked }: { id: number, checked: boolean }) => {
    if (checked) {
      setCheckedProductIds((oldValue) => [...oldValue, id]);
    } else {
      setCheckedProductIds((oldValue) => oldValue.filter((currentId) => currentId !== id));
    }
  };

  return (
    <>
      <Can requiredGroups={['admin', 'manager', 'logistics', 'local']}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => setShowForm(true)} sx={{ mb: '.5rem' }}>
            <Add />
            {trans('addAnotherProduct')}
          </Button>
        </Box>
      </Can>
      <Filter
        onReset={handleReset}
        disabled={disabled()}
        formRepresentation={formRepresentation}
        setValue={(payload: FieldPayload) => {
          setValue(payload);
          setPage(1);
        }}
      />
      <Box sx={{ m: '.5rem' }} />
      <ProductsAction
        disabled={disabled()}
        allChecked={(_.intersectionWith(checkedProductIds, data, (productId: number, product: ProductListItem) => productId === product.id).length === data.length) && data.length != 0}
        checkedProductsCount={checkedProductIds.length}
        onAllCheck={handleAllChecked}
        onPrint={() => printBarcodes(checkedProductIds)}
        onPrintChecklist={() => printChecklists(checkedProductIds)}
        onPrintPriceCard={() => printPriceCards(checkedProductIds)}
        onPrintLabel={() => printLabels(checkedProductIds)}
      />
      <Box sx={{ m: '.5rem' }} />
      <PaginatedTable
        count={count}
        page={page}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        rowsPerPage={rowsPerPage}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('ID')}
            </TableCell>
            <TableCell>
              {trans('sku')}
            </TableCell>
            <TableCell>
              {trans('productName')}
            </TableCell>
            <TableCell>
              {trans('productType')}
            </TableCell>
            <TableCell>
              {trans('location')}
            </TableCell>
            <TableCell>
              {trans('retailPrice')}
            </TableCell>
            <TableCell>
              {trans('purchasePrice')}
            </TableCell>
            <TableCell>
              {trans('purchaseQuantity')}
            </TableCell>
            <TableCell align="right">
              {trans('actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(
            (product: ProductListItem) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={Boolean(checkedProductIds.find((id) => id === product.id))}
                    sx={{ mr: '1.5rem' }}
                    onChange={(e, checked) => handleRowChecked({ id: product.id, checked })}
                    disabled={disabled()}
                  />
                  {product.id}
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>{product.location}</TableCell>
                <TableCell>
                  {product.price}
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="1"
                    defaultValue={product.product_order.price.toString()}
                    onChange={(e) => handleProductPropertyChange(
                      product,
                      'price',
                      e.target.value,
                    )}
                    disabled={!user || !can({ user, requiredGroups: ['admin', 'manager', 'logistics', 'local'] })}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    placeholder="1"
                    defaultValue={product.product_order.quantity.toString()}
                    onChange={(e) => handleProductPropertyChange(
                      product,
                      'quantity',
                      e.target.value,
                    )}
                    disabled={!user || !can({ user, requiredGroups: ['admin', 'manager', 'logistics', 'local'] })}
                  />
                </TableCell>
                <TableCell align="right">
                  <Can requiredGroups={['admin', 'manager', 'logistics', 'local']}>
                    <Edit onClick={() => setEditProductId(product.id)} />
                  </Can>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </PaginatedTable>
      {showForm && (
      <CreateModal
        onClose={() => setShowForm(false)}
        onSubmit={(product: Product) => {
          call({
            params: {
              take: rowsPerPage,
              skip: (page - 1) * rowsPerPage,
              orderId,
            },
          });
          setShowForm(false);
          setEditProductId(product.id);
        }}
        additionalPayloadData={{
          'product_orders[0][order_id]': orderId,
          'product_orders[0][quantity]': '1',
        }}
      />
      )}
      {editProductId && (
      <EditModal
        id={editProductId.toString()}
        onClose={() => setEditProductId(undefined)}
        onSubmit={() => {
          defaultRefreshList();
          setEditProductId(undefined);
        }}
      />
      )}
    </>
  );
}
