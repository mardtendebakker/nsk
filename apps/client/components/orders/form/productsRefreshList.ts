import pushURLParams from '../../../utils/pushURLParams';

export default function refreshList({
  page,
  rowsPerPage = 10,
  formRepresentation,
  router,
  call,
  orderId,
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
      orderId,
    },
  }).then(() => pushURLParams({ params, router })).catch(() => {});
}
