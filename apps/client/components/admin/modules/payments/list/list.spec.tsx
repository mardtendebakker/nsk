import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import List from './list';
import { PaymentListItem } from '../../../../../utils/axios/models/payment';

jest.mock('../../../../../hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    trans: (key) => key,
  }),
}));

const mockPayment: PaymentListItem = {
  id: 1,
  method: 'credit_card',
  transactionId: 'txn_123',
  amount: 1000,
  status: 'paid',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  subscriptionId: null,
  modules: [
    {
      id: 1,
      name: 'Test Module',
      price: 500,
      activeAt: '2024-01-01T00:00:00Z',
      expiresAt: '2024-12-31T00:00:00Z',
    },
  ],
};

const defaultProps = {
  payments: [mockPayment],
  disabled: false,
  count: 1,
  page: 1,
  rowsPerPage: 10,
  onPageChange: jest.fn(),
  onRowsPerPageChange: jest.fn(),
  onSubscribe: jest.fn(),
};

describe('List Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<List {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the payment list with correct data', () => {
    render(<List {...defaultProps} />);

    expect(screen.getByText('method')).toBeInTheDocument();
    expect(screen.getByText('transactionId')).toBeInTheDocument();
    expect(screen.getByText('amount')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('credit_card')).toBeInTheDocument();
    expect(screen.getByText('txn_123')).toBeInTheDocument();
  });

  it('shows different chip variants based on payment status', () => {
    const payments = [
      { ...mockPayment, id: 1, status: 'paid' },
      { ...mockPayment, id: 2, status: 'pending' },
      { ...mockPayment, id: 3, status: 'refunded' },
    ];

    render(<List {...defaultProps} payments={payments} />);

    const chips = screen.getAllByText(/(paid|pending|refunded)/);
    expect(chips).toHaveLength(3);
  });

  it('disables interactions when disabled prop is true', () => {
    render(<List {...defaultProps} disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('handles empty payment list', () => {
    render(<List {...defaultProps} payments={[]} />);

    expect(screen.getByText('method')).toBeInTheDocument();
    expect(screen.getByText('transactionId')).toBeInTheDocument();
    expect(screen.queryByText('credit_card')).not.toBeInTheDocument();
  });

  it('formats prices correctly', () => {
    render(<List {...defaultProps} />);
    waitFor(() => {
      expect(screen.getByText('€ 1.000,00')).toBeInTheDocument();
    });
  });
});
