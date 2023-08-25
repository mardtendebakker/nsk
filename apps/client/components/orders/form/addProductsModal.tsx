import { useEffect, useState } from 'react';
import _ from 'lodash';
import { Box } from '@mui/material';
import ConfirmationDialog from '../../confirmationDialog';
import { STOCK_PRODUCTS_PATH } from '../../../utils/axios';
import useTranslation from '../../../hooks/useTranslation';
import List from '../../stock/list/list';
import useAxios from '../../../hooks/useAxios';
import Filter from '../../stock/list/filter';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import { ProductListItem } from '../../../utils/axios/models/product';
import Checkbox from '../../checkbox';

const initFormState = {
  search: {},
  productType: {},
  location: {},
  productStatus: { },
};

function refreshList({
  page,
  rowsPerPage = 10,
  formRepresentation,
  call,
}) {
  const paramsToSend = {};

  [
    'search',
    'productType',
    'location',
    'productStatus',
  ].forEach((filter) => {
    if (formRepresentation[filter].value || formRepresentation[filter].value === 0) {
      paramsToSend[filter] = formRepresentation[filter].value;
    }
  });

  call({
    params: {
      excludeByOrderDiscr: 's',
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      ...paramsToSend,
    },
  });
}

export default function AddProductsModal({
  onClose,
  onProductsAdded,
}:{
  onClose: ()=>void,
  onProductsAdded: (productIds: number[]) => void,
}) {
  const { trans } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);
  const { formRepresentation, setValue } = useForm(initFormState);

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    STOCK_PRODUCTS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

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

  useEffect(() => {
    refreshList({
      page,
      rowsPerPage,
      formRepresentation,
      call,
    });
  }, [
    page,
    rowsPerPage,
    formRepresentation.search.value,
    formRepresentation.productType.value?.toString(),
    formRepresentation.productStatus.value?.toString(),
    formRepresentation.location.value?.toString(),
  ]);

  return (
    <ConfirmationDialog
      open
      title={<>{trans('addProduct')}</>}
      onClose={onClose}
      onConfirm={() => onProductsAdded(checkedProductIds)}
      content={(
        <form onSubmit={(e) => { e.preventDefault(); onProductsAdded(checkedProductIds); }}>
          <Filter
            disabled={performing}
            onReset={() => {}}
            formRepresentation={formRepresentation}
            setValue={(payload: FieldPayload) => {
              setValue(payload);
              setPage(1);
            }}
          />
          <Box sx={{ m: '.5rem' }} />
          <Checkbox
            disabled={performing}
            checked={(_.intersectionWith(checkedProductIds, data, (productId: number, product: ProductListItem) => productId === product.id).length === data.length) && data.length != 0}
            onCheck={handleAllChecked}
            label={`${trans('selectAll')} ${checkedProductIds.length > 0 ? `(${checkedProductIds.length} ${trans('selected')})` : ''}`}
          />
          <Box sx={{ m: '.5rem' }} />
          <List
            products={data}
            count={count}
            page={page}
            onCheck={handleRowChecked}
            checkedProductIds={checkedProductIds}
            onPageChange={(newPage) => { setPage(newPage); }}
            onRowsPerPageChange={(newRowsPerPage) => {
              setRowsPerPage(newRowsPerPage);
              setPage(1);
            }}
            rowsPerPage={rowsPerPage}
          />
          <input type="submit" style={{ display: 'none' }} />
        </form>
      )}
    />
  );
}