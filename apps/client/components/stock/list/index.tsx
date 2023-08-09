import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { STOCK_PRODUCTS_PATH, STOCK_REPAIRS_PATH, LOCATIONS_PATH } from '../../../utils/axios';
import List from './list';
import useAxios from '../../../hooks/useAxios';
import { STOCKS_PRODUCTS } from '../../../utils/routes';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import Filter from './filter';
import Action from './action';
import ConfirmationDialog from '../../confirmationDialog';
import useTranslation from '../../../hooks/useTranslation';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import EditModal from '../editModal';
import pushURLParams from '../../../utils/pushURLParams';
import { ProductListItem } from '../../../utils/axios/models/product';
import SplitModal, { SplitData } from './splitModal';

function initFormState(
  {
    search, productType, location, productStatus,
  }:
  {
    search?: string,
    productType?: string,
    location?: string,
    productStatus?: string,
  },
) {
  return {
    search: {
      value: search,
    },
    productType: {
      value: productType || undefined,
    },
    location: {
      value: location || undefined,
    },
    productStatus: {
      value: productStatus || undefined,
    },
  };
}

function refreshList({
  page,
  rowsPerPage = 10,
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.append('page', page.toString());
  }

  params.append('rowsPerPage', rowsPerPage.toString());

  const paramsToSend = {};

  [
    'search',
    'productType',
    'location',
    'productStatus',
  ].forEach((filter) => {
    if (formRepresentation[filter].value || formRepresentation[filter].value === 0) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
    }
  });

  call({
    params: {
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      ...paramsToSend,
    },
  }).finally(() => pushURLParams({ params, router }));
}

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [showChangeLocationModal, setShowChangeLocationModal] = useState(false);
  const [changeLocationValue, setChangeLocationValue] = useState<number | undefined>();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(router.query?.rowsPerPage?.toString() || '10', 10));
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);
  const [splitProduct, setSplitProduct] = useState<ProductListItem | undefined>();

  const ajaxPath = router.pathname == STOCKS_PRODUCTS
    ? STOCK_PRODUCTS_PATH
    : STOCK_REPAIRS_PATH;

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: router.query?.search?.toString(),
    productType: router.query?.productType?.toString(),
    location: router.query?.location?.toString(),
    productStatus: router.query?.productStatus?.toString(),
  }));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
    ajaxPath,
    {
      withProgressBar: true,
      showSuccessMessage: true,
    },
  );

  const { call: callPatch, performing: performingPatch } = useAxios(
    'patch',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
      showSuccessMessage: true,
    },
  );

  useEffect(() => {
    refreshList({
      page,
      rowsPerPage,
      formRepresentation,
      router,
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

  const handleDelete = (id: number) => {
    callDelete({ path: ajaxPath.replace(':id', id.toString()) })
      .then(() => {
        refreshList({
          page,
          rowsPerPage,
          formRepresentation,
          router,
          call,
        });
      });
  };

  const disabled = (): boolean => performing || performingDelete || performingPatch;

  const handlePatchLocation = () => {
    callPatch({ body: { ids: checkedProductIds, product: { location_id: changeLocationValue } } })
      .then(() => {
        setCheckedProductIds([]);
        refreshList({
          page,
          rowsPerPage,
          formRepresentation,
          router,
          call,
        });
      })
      .finally(() => {
        setShowChangeLocationModal(false);
        setChangeLocationValue(undefined);
      });
  };

  const handleSplit = (data: SplitData) => {
    // TODO call endpoint to perform a split
  };

  const handleReset = () => {
    setData(initFormState({}));
    setPage(1);
  };

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
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
      <Action
        disabled={disabled()}
        allChecked={(_.intersectionWith(checkedProductIds, data, (productId: number, product: ProductListItem) => productId === product.id).length === data.length) && data.length != 0}
        checkedProductsCount={checkedProductIds.length}
        onAllCheck={handleAllChecked}
        onChangeLocation={() => setShowChangeLocationModal(true)}
        onPrint={() => {}}
      />
      <Box sx={{ m: '.5rem' }} />
      <List
        disabled={disabled()}
        products={data}
        count={Math.ceil(count / rowsPerPage)}
        page={page}
        onCheck={handleRowChecked}
        checkedProductIds={checkedProductIds}
        onPageChange={setPage}
        onSplit={(product: ProductListItem) => setSplitProduct(product)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
        rowsPerPage={rowsPerPage}
        onEdit={(id) => setEditProductId(id)}
        onDelete={handleDelete}
      />
      {editProductId && (
        <EditModal
          onClose={() => setEditProductId(undefined)}
          onSubmit={() => setEditProductId(undefined)}
          id={editProductId.toString()}
        />
      )}
      {showChangeLocationModal && (
      <ConfirmationDialog
        disabled={!changeLocationValue}
        title={<>{trans('changeLocation')}</>}
        content={(
          <form onSubmit={(e) => { e.preventDefault(); handlePatchLocation(); }}>
            {trans('changeLocationContent')}
            <Box sx={{ pb: '2rem' }} />
            <DataSourcePicker
              url={LOCATIONS_PATH.replace(':id', '')}
              searchKey="name"
              disabled={disabled()}
              fullWidth
              placeholder={trans('selectLocation')}
              onChange={(value: { id: number }) => setChangeLocationValue(value?.id)}
              value={changeLocationValue?.toString()}
            />
            <input type="submit" style={{ display: 'none' }} />
          </form>
        )}
        onConfirm={handlePatchLocation}
        onClose={() => setShowChangeLocationModal(false)}
        confirmButtonText={trans('save')}
      />
      )}
      {splitProduct && (
      <SplitModal
        product={splitProduct}
        onClose={() => setSplitProduct(undefined)}
        onConfirm={handleSplit}
      />
      )}
    </Card>
  );
}
