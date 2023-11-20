import { fireEvent, render, waitFor } from '@testing-library/react';
import Logistics from '.';

const mockRouter = {
  replace: jest.fn(),
};

const customer = {
  city: 'city',
  country: 'country',
  state: 'state',
  zip: 'zip',
  street: 'street',
  phone: 'phone',
  company_name: 'company_name',
  email: 'email',
  name: 'name',
};

const order = {
  id: 1,
  order_nr: 'string',
  order_status: { color: 'red' },
  supplier: customer,
  customer,
};

const logistic = {
  id: 11,
  username: 'username1',
  firstname: 'firstname1',
  lastname: 'lastname1',
  email: 'email1@gmail.com',
};

const mockAxios = {
  call: jest.fn(() => Promise.resolve()),
  data: {
    data: [{
      id: 11,
      event_date: '2020-10-09 11:10:10',
      event_title: 'event11',
      order,
      logistic,
    }, {
      id: 22,
      event_date: '2020-10-09 11:10:10',
      event_title: 'event22',
      order,
      logistic,
    }, {
      id: 99,
      event_date: '2020-12-09 11:10:10',
      event_title: 'event99',
      order,
      logistic,
    }],
  },
};

jest.mock('../../hooks/useAxios', () => () => mockAxios);
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));
jest.mock('../../utils/location', () => ({ getQueryParam: () => '2020-10-10 10:10:10' }));
jest.mock('./sideMap', () => function SideMap() {
  return <div>sideMap</div>;
});

describe('Logistics component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot', () => {
    const { asFragment, queryByText } = render(<Logistics type="pickup" />);
    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('maandag 5')).toBeInTheDocument();
    expect(queryByText('dinsdag 6')).toBeInTheDocument();
    expect(queryByText('woensdag 7')).toBeInTheDocument();
    expect(queryByText('donderdag 8')).toBeInTheDocument();
    expect(queryByText('vrijdag 9')).toBeInTheDocument();
    expect(queryByText('event11, 11:10')).toBeInTheDocument();
    expect(queryByText('event22, 11:10')).toBeInTheDocument();
    expect(queryByText('event99, 11:10')).toBeNull();
  });

  it('filters properly', () => {
    const { getByPlaceholderText, queryByText } = render(<Logistics type="pickup" />);
    fireEvent.change(getByPlaceholderText('logisticsPage.search.placeholder'), { target: { value: 'noop' } });
    expect(queryByText('event11, 11:10')).toBeNull();
    expect(queryByText('event22, 11:10')).toBeNull();
  });

  it('paginate to next page properly', () => {
    const { getByTestId, queryByText } = render(<Logistics type="pickup" />);
    fireEvent.click(getByTestId('next'));

    expect(mockAxios.call).toBeCalledWith({ params: { endsAt: '2020-10-10', startsAt: '2020-10-05' } });
    expect(mockAxios.call).toBeCalledWith({ params: { endsAt: '2020-10-17', startsAt: '2020-10-12' } });

    expect(queryByText('maandag 12')).toBeInTheDocument();
    expect(queryByText('dinsdag 13')).toBeInTheDocument();
    expect(queryByText('woensdag 14')).toBeInTheDocument();
    expect(queryByText('donderdag 15')).toBeInTheDocument();
    expect(queryByText('vrijdag 16')).toBeInTheDocument();
  });

  it('paginate to previous page properly', async () => {
    const { getByTestId, queryByText } = render(<Logistics type="pickup" />);
    await waitFor(() => fireEvent.click(getByTestId('previous')));

    expect(mockAxios.call).toBeCalledWith({ params: { endsAt: '2020-10-10', startsAt: '2020-10-05' } });
    expect(mockAxios.call).toBeCalledWith({ params: { endsAt: '2020-10-03', startsAt: '2020-09-28' } });
    expect(queryByText('maandag 28')).toBeInTheDocument();
    expect(queryByText('dinsdag 29')).toBeInTheDocument();
    expect(queryByText('woensdag 30')).toBeInTheDocument();
    expect(queryByText('donderdag 1')).toBeInTheDocument();
    expect(queryByText('vrijdag 2')).toBeInTheDocument();
  });

  it('opens sidemap', () => {
    const { getByText, queryByText } = render(<Logistics type="pickup" />);
    expect(queryByText('sideMap')).toBeNull();
    fireEvent.click(getByText('event22, 11:10'));
    expect(queryByText('sideMap')).toBeInTheDocument();
  });
});
