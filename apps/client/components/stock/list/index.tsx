import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import {
  STOCK_PRODUCTS_PATH, STOCK_REPAIRS_PATH, SPLIT_PRODUCT_INDIVIDUALIZE_PATH, SPLIT_PRODUCT_STOCK_PART_PATH, APRODUCT_BULK_PRINT_BARCODES, AxiosResponse, APRODUCT_BULK_PRINT_CHECKLISTS, APRODUCT_BULK_PRINT_PRICECARDS, STOCK_ARCHIVED_PATH, APRODUCTS_ARCHIVE_SET, APRODUCTS_ARCHIVE_UNSET,
} from '../../../utils/axios';
import List from './list';
import useAxios from '../../../hooks/useAxios';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import Filter from './filter';
import Action from './action';
import EditModal from '../editModal';
import pushURLParams from '../../../utils/pushURLParams';
import { ProductListItem } from '../../../utils/axios/models/product';
import SplitModal, { SplitData } from './splitModal';
import { getQueryParam } from '../../../utils/location';
import { openBlob } from '../../../utils/blob';
import Header from '../header';
import can from '../../../utils/can';
import useSecurity from '../../../hooks/useSecurity';
import PatchLocationModal from './patchLocationModal';

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
  }).then(() => pushURLParams({ params, router })).catch(() => {});
}

const AJAX_PATHS = {
  product: STOCK_PRODUCTS_PATH,
  repair: STOCK_REPAIRS_PATH,
  archived: STOCK_ARCHIVED_PATH,
};

export default function ListContainer({ type } : { type: 'product' | 'repair' | 'archived' }) {
  const { state: { user } } = useSecurity();
  const router = useRouter();
  const [showChangeLocationModal, setShowChangeLocationModal] = useState(false);
  const [page, setPage] = useState<number>(parseInt(getQueryParam('page', '1'), 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(parseInt(getQueryParam('rowsPerPage', '10'), 10));
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);
  const [splitProduct, setSplitProduct] = useState<ProductListItem | undefined>();

  const ajaxPath = AJAX_PATHS[type] || STOCK_PRODUCTS_PATH;

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: getQueryParam('search'),
    productType: getQueryParam('productType'),
    location: getQueryParam('location'),
    productStatus: getQueryParam('productStatus'),
  }));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios<undefined | { data?: ProductListItem[], count?: number }>(
    'get',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );
  const { call: bulkPrint, performing: performingBulkPrintBarcodes } = useAxios('get', APRODUCT_BULK_PRINT_BARCODES);
  const { call: bulkPrintChecklist, performing: performingBulkPrintChecklists } = useAxios('get', APRODUCT_BULK_PRINT_CHECKLISTS);
  const { call: bulkPrintPriceCard, performing: performingBulkPrintPriceCards } = useAxios('get', APRODUCT_BULK_PRINT_PRICECARDS);
  const { call: bulkPatchArchive, performing: performingBulkPatchArchive } = useAxios('patch', APRODUCTS_ARCHIVE_SET);
  const { call: bulkPatchUnarchive, performing: performingBulkPatchUnarchive } = useAxios('patch', APRODUCTS_ARCHIVE_UNSET);
  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
    ajaxPath,
    {
      withProgressBar: true,
      showSuccessMessage: true,
    },
  );
  const { call: callPatchLocation, performing: performingPatchLocation } = useAxios(
    'patch',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
      showSuccessMessage: true,
    },
  );
  const { call: splitCall, performing: performingSplit } = useAxios(
    'put',
    '',
    {
      withProgressBar: true,
      showSuccessMessage: true,
    },
  );

  const defaultRefreshList = () => refreshList({
    page,
    rowsPerPage,
    formRepresentation,
    router,
    call,
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
      .then(() => defaultRefreshList());
  };

  const disabled = (): boolean => performing || performingDelete || performingPatchLocation || performingBulkPatchArchive || performingBulkPatchUnarchive || performingSplit || performingBulkPrintBarcodes || performingBulkPrintChecklists || performingBulkPrintPriceCards;

  const handlePatchArchive = () => {
    bulkPatchArchive({ body: checkedProductIds })
      .then(() => {
        setCheckedProductIds([]);
        defaultRefreshList();
      });
  };

  const handlePatchUnarchive = () => {
    bulkPatchUnarchive({ body: checkedProductIds })
      .then(() => {
        setCheckedProductIds([]);
        defaultRefreshList();
      });
  };

  const handlePatchLocation = (product) => {
    callPatchLocation({ body: { ids: checkedProductIds, product } })
      .then(() => {
        setCheckedProductIds([]);
        defaultRefreshList();
      })
      .finally(() => {
        setShowChangeLocationModal(false);
      });
  };

  const handlePrintBarcodes = () => {
    bulkPrint({ params: { ids: checkedProductIds }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      });
  };

  const handlePrintChecklists = () => {
    bulkPrintChecklist({ params: { ids: checkedProductIds }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      });
  };

  const handlePrintPriceCards = () => {
    bulkPrintPriceCard({ params: { ids: checkedProductIds }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      });
  };

  const handleSplit = (splitData: SplitData) => {
    const path = (splitData.mode == 'individualize'
      ? SPLIT_PRODUCT_INDIVIDUALIZE_PATH
      : SPLIT_PRODUCT_STOCK_PART_PATH).replace(':id', splitProduct.id.toString());

    setSplitProduct(undefined);

    splitCall({
      path,
      body: {
        quantity: splitData.value,
        newSku: !!splitData.newSKU,
        status: splitData.statusId,
      },
    })
      .then(() => defaultRefreshList());
  };

  const handleReset = () => {
    setData(initFormState({}));
    setPage(1);
  };

  return (
    <>
      <Header onProductCreated={defaultRefreshList} />
      <Card sx={{ overflowX: 'auto', p: '1.5rem', mt: '1.5rem' }}>
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
          type={type}
          allChecked={(_.intersectionWith(checkedProductIds, data, (productId: number, product: ProductListItem) => productId === product.id).length === data.length) && data.length != 0}
          checkedProductsCount={checkedProductIds.length}
          onAllCheck={handleAllChecked}
          onArchive={handlePatchArchive}
          onUnarchive={handlePatchUnarchive}
          onChangeLocation={() => setShowChangeLocationModal(true)}
          onPrint={handlePrintBarcodes}
          onPrintChecklist={handlePrintChecklists}
          onPrintPriceCard={handlePrintPriceCards}
        />
        <Box sx={{ m: '.5rem' }} />
        <List
          type={type}
          disabled={disabled()}
          products={data}
          count={count}
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
          onDelete={can(user?.groups || [], ['admin', 'super_admin', 'manager']) ? handleDelete : undefined}
        />
        {editProductId && (
        <EditModal
          onClose={() => setEditProductId(undefined)}
          onSubmit={() => setEditProductId(undefined)}
          id={editProductId.toString()}
          type={type}
        />
        )}
        {showChangeLocationModal && (
        <PatchLocationModal
          onClose={() => setShowChangeLocationModal(false)}
          onSubmit={handlePatchLocation}
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
    </>
  );
}
