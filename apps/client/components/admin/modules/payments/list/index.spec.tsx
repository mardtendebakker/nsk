import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import useCart from '../../../../../hooks/useCart';
import { getQueryParam } from '../../../../../utils/location';
import Payments from '.';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}));

jest.mock('../../../../../hooks/useAxios');
jest.mock('../../../../../hooks/useTranslation');
jest.mock('../../../../../hooks/useCart');
jest.mock('../../../../../utils/pushURLParams');
jest.mock('../../../../../utils/location');
jest.mock('./list', () => ({
  __esModule: true,
  default: ({
    payments, onPageChange, onRowsPerPageChange, onSubscribe, disabled,
  }) => (
    <div data-testid="mock-list">
      {payments?.map((payment) => (
        <div key={payment.id} data-testid={`payment-${payment.id}`} />
      ))}
      <button onClick={() => onPageChange(2)} data-testid="change-page" type="button" disabled={disabled}>Change Page</button>
      <button onClick={() => onRowsPerPageChange(20)} data-testid="change-rows" type="button" disabled={disabled}>Change Rows</button>
      <button onClick={() => onSubscribe({ id: 1 }, true)} data-testid="subscribe" type="button" disabled={disabled}>Subscribe</button>
    </div>
  ),
}));

describe('Payments Component', () => {
  const mockCall = jest.fn().mockResolvedValue({ data: [], count: 0 });
  const mockCallSubscribe = jest.fn().mockResolvedValue({});
  const mockCallUnsubscribe = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    jest.clearAllMocks();
    (useAxios as jest.Mock).mockImplementation((method) => {
      if (method === 'post') {
        return { call: mockCallSubscribe, performing: false };
      }
      if (method === 'delete') {
        return { call: mockCallUnsubscribe, performing: false };
      }
      return {
        call: mockCall,
        performing: false,
        data: { data: [], count: 0 },
      };
    });

    (getQueryParam as jest.Mock).mockImplementation((param, defaultValue) => defaultValue);
    (useTranslation as jest.Mock).mockImplementation(() => ({
      trans: (key: string) => key,
    }));
    (useCart as jest.Mock).mockImplementation(() => ({
      clearCart: jest.fn(),
    }));
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Payments />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('initializes with correct default values', () => {
    render(<Payments />);
    expect(mockCall).toHaveBeenCalledWith({
      params: {
        take: 10,
        skip: 0,
      },
    });
  });

  it('handles page change correctly', async () => {
    render(<Payments />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('change-page'));
    });

    expect(mockCall).toHaveBeenCalledWith({
      params: {
        take: 10,
        skip: 10,
      },
    });
  });

  it('handles rows per page change correctly', async () => {
    render(<Payments />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('change-rows'));
    });

    expect(mockCall).toHaveBeenCalledWith({
      params: {
        take: 20,
        skip: 0,
      },
    });
  });

  it('handles subscription correctly', async () => {
    render(<Payments />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('subscribe'));
    });

    expect(mockCallSubscribe).toHaveBeenCalledWith({
      path: expect.stringContaining('1'),
    });

    await waitFor(() => {
      expect(mockCall).toHaveBeenCalled();
    });
  });

  it('clears cart when clearCart query param is 1', () => {
    (getQueryParam as jest.Mock).mockImplementation((param, defaultValue) => {
      if (param === 'clearCart') return '1';
      return defaultValue;
    });

    const mockClearCart = jest.fn();
    (useCart as jest.Mock).mockImplementation(() => ({
      clearCart: mockClearCart,
    }));

    render(<Payments />);
    expect(mockClearCart).toHaveBeenCalled();
  });

  it('displays payments data correctly', () => {
    const mockPayments = [
      { id: 1, amount: 100 },
      { id: 2, amount: 200 },
    ];

    (useAxios as jest.Mock).mockImplementation(() => ({
      call: mockCall,
      performing: false,
      data: { data: mockPayments, count: 2 },
    }));

    render(<Payments />);
    expect(screen.getByTestId('payment-1')).toBeInTheDocument();
    expect(screen.getByTestId('payment-2')).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    (useAxios as jest.Mock).mockImplementation(() => ({
      call: mockCall,
      performing: true,
      data: { data: [], count: 0 },
    }));

    render(<Payments />);
    waitFor(() => {
      expect(screen.getByTestId('change-page')).toHaveAttribute('disabled', 'true');
      expect(screen.getByTestId('change-rows')).toHaveAttribute('disabled', 'true');
      expect(screen.getByTestId('subscribe')).toHaveAttribute('disabled', 'true');
    });
  });
});
