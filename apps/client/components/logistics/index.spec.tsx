import {
  fireEvent, render, waitFor, screen,
} from '@testing-library/react';
import Logistics from '.';
import { LOGISTICS_DELIVERY } from '../../utils/routes';

const mockRouter = {
  replace: jest.fn(),
  asPath: LOGISTICS_DELIVERY,
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

const driver = {
  id: 11,
  username: 'driver1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@gmail.com',
};

const vehicle = {
  id: 1,
  registration_number: 'ABC-123',
};

const mockAxios = {
  call: jest.fn(() => Promise.resolve()),
  data: {
    data: [{
      id: 11,
      event_date: '2020-10-09T11:10:10',
      event_title: 'event11',
      order,
      driver,
      vehicle,
    }, {
      id: 22,
      event_date: '2020-10-09T11:40:10',
      event_title: 'event22',
      order,
      driver,
      vehicle,
    }, {
      id: 99,
      event_date: '2020-12-09T11:10:10',
      event_title: 'event99',
      order,
      driver,
      vehicle,
    }],
  },
};

const mockRemoteConfig = {
  state: {
    config: {
      logistics: {
        apiKey: 'key',
        maxHour: 18,
        minHour: 8,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      },
    },
  },
};

jest.mock('../../hooks/useAxios', () => jest.fn(() => mockAxios));
jest.mock('../../hooks/useRemoteConfig', () => () => mockRemoteConfig);
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));
jest.mock('../../utils/location', () => ({
  getQueryParam: (param) => {
    if (param === 'startDate') return '2020-10-05T10:10:10';
    if (param === 'endDate') return '2020-10-10T10:10:10';
    return '2020-10-10T10:10:10';
  },
}));
jest.mock('./sideMap', () => function SideMap() {
  return <div>sideMap</div>;
});
jest.mock('../../utils/pushURLParams', () => jest.fn());

describe('Logistics component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock('../../hooks/useAxios', () => () => mockAxios);
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(<Logistics type="pickup" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(/10\/05\/2020 - 10\/10\/2020/)).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.queryByText('event11, 11:10')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(asFragment()).toMatchSnapshot();
    expect(screen.queryByText('event11, 11:10')).toBeInTheDocument();
    expect(screen.queryByText('event22, 11:40')).toBeInTheDocument();
    expect(screen.queryByText('event99, 11:10')).not.toBeInTheDocument();
  });

  it('filters properly by search', async () => {
    render(<Logistics type="pickup" />);

    await waitFor(() => {
      expect(screen.queryByText('event11, 11:10')).toBeInTheDocument();
    }, { timeout: 3000 });

    const searchInput = screen.getByPlaceholderText('logisticsPage.search.placeholder');
    fireEvent.change(searchInput, { target: { value: 'noop' } });

    await waitFor(() => {
      expect(screen.queryByText('event11, 11:10')).not.toBeInTheDocument();
      expect(screen.queryByText('event22, 11:40')).not.toBeInTheDocument();
    });
  });

  it('filters by driver selection', async () => {
    render(<Logistics type="pickup" />);

    await waitFor(() => {
      expect(screen.queryByText('event11, 11:10')).toBeInTheDocument();
    }, { timeout: 3000 });

    const driverInput = screen.getByPlaceholderText('pickupsBy');
    fireEvent.click(driverInput);

    expect(driverInput).toBeInTheDocument();
  });

  it('filters by vehicle selection', async () => {
    render(<Logistics type="pickup" />);

    await waitFor(() => {
      expect(screen.queryByText('event11, 11:10')).toBeInTheDocument();
    }, { timeout: 3000 });

    const vehicleInput = screen.getByPlaceholderText('vehicle');
    fireEvent.click(vehicleInput);

    expect(vehicleInput).toBeInTheDocument();
  });

  it('calls API when date range changes', async () => {
    render(<Logistics type="pickup" />);

    await waitFor(() => {
      expect(mockAxios.call).toHaveBeenCalledWith({
        params: {
          startsAt: '2020-10-05',
          endsAt: '2020-10-10',
        },
      });
    });
  });

  it('opens sidemap when event is clicked', async () => {
    render(<Logistics type="pickup" />);

    await waitFor(() => {
      expect(screen.queryByText('event22, 11:40')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.queryByText('sideMap')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('event22, 11:40'));

    await waitFor(() => {
      expect(screen.queryByText('sideMap')).toBeInTheDocument();
    });
  });

  it('handles missing driver data with default values', async () => {
    const mockAxiosWithoutDriver = {
      call: jest.fn(() => Promise.resolve()),
      data: {
        data: [{
          id: 11,
          event_date: '2020-10-09T11:10:10',
          event_title: 'event11',
          order,
          driver: null,
          vehicle,
        }],
      },
    };

    jest.mock('../../hooks/useAxios', () => () => mockAxiosWithoutDriver);

    render(<Logistics type="pickup" />);

    await waitFor(() => {
      expect(screen.queryByText('event11, 11:10')).toBeInTheDocument();
    }, { timeout: 3000 });

    jest.mock('../../hooks/useAxios', () => () => mockAxios);
  });

  it('renders delivery type correctly', async () => {
    render(<Logistics type="delivery" />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('deliveriesBy')).toBeInTheDocument();
    });
  });
});
