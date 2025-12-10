import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import _ from 'lodash';
import { trans } from 'itranslator';
import {
  STOCK_PRODUCTS_PATH,
  STOCK_WEBSHOP_PATH,
  STOCK_REPAIRS_PATH,
  SPLIT_PRODUCT_INDIVIDUALIZE_PATH,
  SPLIT_PRODUCT_STOCK_PART_PATH,
  STOCK_ARCHIVED_PATH,
  APRODUCTS_ARCHIVE_SET,
  APRODUCTS_ARCHIVE_UNSET,
  APRODUCT_BULK_PUBLISH_TO_STORE,
  AxiosResponse,
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
import Header from '../header';
import can from '../../../utils/can';
import useSecurity from '../../../hooks/useSecurity';
import PatchLocationModal from './patchLocationModal';
import PatchProductTypeModal from './patchProductTypeModal';
import PatchPriceModal from './patchPriceModal';
import { ProductType } from '../type';
import useBulkPrintChecklist from '../../../hooks/apiCalls/useBulkPrintChecklist';
import useBulkPrintPriceCards from '../../../hooks/apiCalls/useBulkPrintPriceCards';
import useBulkPrintLabels from '../../../hooks/apiCalls/useBulkPrintLabels';
import useBulkPrintBarcodes from '../../../hooks/apiCalls/useBulkPrintBarcodes';
import PatchStatusModal from './patchStatusModal';

function initFormState({
  search,
  productType,
  location,
  locationLabel,
  productStatus,
}: {
  search?: string;
  productType?: string;
  location?: string;
  locationLabel?: string;
  productStatus?: string;
}) {
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
    locationLabel: {
      value: locationLabel || undefined,
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
  type,
}: {
  page: number;
  rowsPerPage: number;
  formRepresentation: object;
  router: NextRouter;
  call;
  type: ProductType;
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
    'locationLabel',
    'productStatus',
  ].forEach((filter) => {
    if (
      formRepresentation[filter].value ||
      formRepresentation[filter].value === 0
    ) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
    }
  });

  call({
    params: {
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      inStockOnly: type == 'product' ? 1 : 0,
      outOfStockOnly: type == 'outOfStock' ? 1 : 0,
      ...paramsToSend,
    },
  })
    .then(() => pushURLParams({ params, router }))
    .catch(() => {});
}

const AJAX_PATHS = {
  product: STOCK_PRODUCTS_PATH,
  repair: STOCK_REPAIRS_PATH,
  archived: STOCK_ARCHIVED_PATH,
  webshop: STOCK_WEBSHOP_PATH,
  outOfStock: STOCK_PRODUCTS_PATH,
};

export default function ListContainer({ type }: { type: ProductType }) {
  const {
    state: { user },
  } = useSecurity();
  const router = useRouter();
  const [showChangeLocationModal, setShowChangeLocationModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [showChangeProductTypeModal, setShowChangeProductTypeModal] =
    useState(false);
  const [showChangePriceModal, setShowChangePriceModal] = useState(false);
  const [page, setPage] = useState<number>(
    parseInt(getQueryParam('page', '1'), 10)
  );
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    parseInt(getQueryParam('rowsPerPage', '10'), 10)
  );
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);
  const [splitProduct, setSplitProduct] = useState<
    ProductListItem | undefined
  >();

  const ajaxPath = AJAX_PATHS[type] || STOCK_PRODUCTS_PATH;

  const { formRepresentation, setValue, setData } = useForm(
    initFormState({
      search: getQueryParam('search'),
      productType: getQueryParam('productType'),
      location: getQueryParam('location'),
      locationLabel: getQueryParam('locationLabel'),
      productStatus: getQueryParam('productStatus'),
    })
  );

  const {
    data: { data = [], count = 0 } = {},
    call,
    performing,
  } = useAxios<undefined | { data?: ProductListItem[]; count?: number }>(
    'get',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
    }
  );
  const { printBarcodes, performing: performingBulkPrintBarcodes } =
    useBulkPrintBarcodes({ withProgressBar: true });
  const { printChecklists, performing: performingBulkPrintChecklists } =
    useBulkPrintChecklist({ withProgressBar: true });
  const { printPriceCards, performing: performingBulkPrintPriceCards } =
    useBulkPrintPriceCards({ withProgressBar: true });
  const { printLabels, performing: performingBulkPrintLabels } =
    useBulkPrintLabels({ withProgressBar: true });
  const { call: bulkPatchArchive, performing: performingBulkPatchArchive } =
    useAxios('patch', APRODUCTS_ARCHIVE_SET, { withProgressBar: true });
  const { call: bulkPublishToStore, performing: performingBulkPublishToStore } =
    useAxios('post', APRODUCT_BULK_PUBLISH_TO_STORE, {
      showSuccessMessage: true,
      withProgressBar: true,
      customSuccessMessage: (response: AxiosResponse) => trans(response.data),
    });
  const { call: bulkPatchUnarchive, performing: performingBulkPatchUnarchive } =
    useAxios('patch', APRODUCTS_ARCHIVE_UNSET, { withProgressBar: true });
  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
    ajaxPath,
    {
      withProgressBar: true,
      showSuccessMessage: true,
    }
  );
  const { call: callPatch, performing: performingPatch } = useAxios(
    'patch',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
      showSuccessMessage: true,
    }
  );
  const { call: splitCall, performing: performingSplit } = useAxios('put', '', {
    withProgressBar: true,
    showSuccessMessage: true,
  });

  const defaultRefreshList = () =>
    refreshList({
      page,
      rowsPerPage,
      formRepresentation,
      router,
      call,
      type,
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

  const handleAllChecked = (checked: boolean) => {
    setCheckedProductIds(
      checked
        ? _.union(
            checkedProductIds,
            data.map(({ id }) => id)
          )
        : checkedProductIds.filter(
            (productId) =>
              !data.find((product: ProductListItem) => product.id == productId)
          )
    );
  };

  const handleRowChecked = ({
    id,
    checked,
  }: {
    id: number;
    checked: boolean;
  }) => {
    if (checked) {
      setCheckedProductIds((oldValue) => [...oldValue, id]);
    } else {
      setCheckedProductIds((oldValue) =>
        oldValue.filter((currentId) => currentId !== id)
      );
    }
  };

  const handleDelete = (id: number) => {
    callDelete({ path: ajaxPath.replace(':id', id.toString()) }).then(() =>
      defaultRefreshList()
    );
  };

  const disabled = (): boolean =>
    performing ||
    performingBulkPublishToStore ||
    performingDelete ||
    performingPatch ||
    performingBulkPatchArchive ||
    performingBulkPatchUnarchive ||
    performingSplit ||
    performingBulkPrintBarcodes ||
    performingBulkPrintChecklists ||
    performingBulkPrintPriceCards ||
    performingBulkPrintLabels;

  const handlePatchArchive = () => {
    bulkPatchArchive({ body: checkedProductIds }).then(() => {
      setCheckedProductIds([]);
      defaultRefreshList();
    });
  };

  const handlePublishToStore = () => {
    bulkPublishToStore({ body: checkedProductIds }).then(() => {
      setCheckedProductIds([]);
    });
  };

  const handlePatchUnarchive = () => {
    bulkPatchUnarchive({ body: checkedProductIds }).then(() => {
      setCheckedProductIds([]);
      defaultRefreshList();
    });
  };

  const handleSubmitEditProduct = () => {
    setEditProductId(undefined);
    defaultRefreshList();
  };

  const handlePatch = (product) => {
    callPatch({ body: { ids: checkedProductIds, product } })
      .then(() => {
        setCheckedProductIds([]);
        defaultRefreshList();
      })
      .finally(() => {
        setShowChangeLocationModal(false);
        setShowChangeProductTypeModal(false);
        setShowChangeStatusModal(false);
        setShowChangePriceModal(false);
      });
  };

  const handleSplit = (splitData: SplitData) => {
    const path = (
      splitData.mode == 'individualize'
        ? SPLIT_PRODUCT_INDIVIDUALIZE_PATH
        : SPLIT_PRODUCT_STOCK_PART_PATH
    ).replace(':id', splitProduct.id.toString());

    setSplitProduct(undefined);

    splitCall({
      path,
      body: {
        quantity: splitData.value,
        newSku: !!splitData.newSKU,
        status: splitData.statusId,
      },
    }).then(() => defaultRefreshList());
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
          allChecked={
            _.intersectionWith(
              checkedProductIds,
              data,
              (productId: number, product: ProductListItem) =>
                productId === product.id
            ).length === data.length && data.length != 0
          }
          checkedProductsCount={checkedProductIds.length}
          onAllCheck={handleAllChecked}
          onArchive={handlePatchArchive}
          onUnarchive={handlePatchUnarchive}
          onChangeStatus={() => setShowChangeStatusModal(true)}
          onChangeLocation={() => setShowChangeLocationModal(true)}
          onChangeProductType={() => setShowChangeProductTypeModal(true)}
          onChangePrice={() => setShowChangePriceModal(true)}
          onPrint={() => printBarcodes(checkedProductIds)}
          onPrintChecklist={() => printChecklists(checkedProductIds)}
          onPrintPriceCard={() => printPriceCards(checkedProductIds)}
          onPrintLabel={() => printLabels(checkedProductIds)}
          onPublishToStore={handlePublishToStore}
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
          onDelete={
            user && can({ user, requiredGroups: ['admin', 'manager'] })
              ? handleDelete
              : undefined
          }
        />
        {editProductId && (
          <EditModal
            onClose={() => setEditProductId(undefined)}
            onSubmit={handleSubmitEditProduct}
            id={editProductId.toString()}
            type={type}
          />
        )}
        {showChangeStatusModal && (
          <PatchStatusModal
            onClose={() => setShowChangeStatusModal(false)}
            onSubmit={handlePatch}
          />
        )}
        {showChangeLocationModal && (
          <PatchLocationModal
            onClose={() => setShowChangeLocationModal(false)}
            onSubmit={handlePatch}
          />
        )}
        {showChangeProductTypeModal && (
          <PatchProductTypeModal
            onClose={() => setShowChangeProductTypeModal(false)}
            onSubmit={handlePatch}
          />
        )}
        {showChangePriceModal && (
          <PatchPriceModal
            onClose={() => setShowChangePriceModal(false)}
            onSubmit={handlePatch}
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
