import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/router';
import Cart from '.';
import useCart from '../../../../hooks/useCart';
import useAxios from '../../../../hooks/useAxios';
import useTranslation from '../../../../hooks/useTranslation';
import { ADMIN_MODULES_PAYMENTS } from '../../../../utils/routes';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../../hooks/useCart', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../hooks/useAxios', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./moduleLine', () => ({
  __esModule: true,
  default: function MockModuleLine({ module }) {
    return <div data-testid={`module-${module.id}`}>{module.name}</div>;
  },
}));

describe('Cart Component', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockTranslations = {
    cart: 'Shopping Cart',
    total: 'Total',
    pay: 'Pay Now',
    emptyCartMessage: 'Your cart is empty',
  };

  const mockModules = [
    { id: 1, name: 'Module 1', price: 100 },
    { id: 2, name: 'Module 2', price: 200 },
  ];

  const mockAxiosCall = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    (useTranslation as jest.Mock).mockReturnValue({
      trans: (key: string) => mockTranslations[key],
    });

    (useCart as jest.Mock).mockReturnValue({
      state: { modules: [] },
      totalAmount: () => 0,
    });

    (useAxios as jest.Mock).mockReturnValue({
      call: mockAxiosCall,
      performing: false,
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Cart />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty cart message when no modules present', () => {
    render(<Cart />);

    expect(screen.getByText(mockTranslations.emptyCartMessage)).toBeInTheDocument();
    expect(screen.queryByText(mockTranslations.total)).not.toBeInTheDocument();
  });

  it('renders cart with modules and total when modules are present', () => {
    (useCart as jest.Mock).mockReturnValue({
      state: { modules: mockModules },
      totalAmount: () => 300,
    });

    render(<Cart />);

    mockModules.forEach((module) => {
      expect(screen.getByTestId(`module-${module.id}`)).toBeInTheDocument();
    });

    expect(screen.getByText(mockTranslations.total)).toBeInTheDocument();
    expect(screen.getByText('€ 300,00')).toBeInTheDocument();
  });

  it('handles payment flow correctly', async () => {
    const totalAmount = 300;
    const paymentUrl = 'https://payment.example.com';
    (useCart as jest.Mock).mockReturnValue({
      state: { modules: mockModules },
      totalAmount: () => totalAmount,
    });

    mockAxiosCall.mockResolvedValue({ data: paymentUrl });

    render(<Cart />);

    const payButton = screen.getByText(mockTranslations.pay);
    fireEvent.click(payButton);

    expect(mockAxiosCall).toHaveBeenCalledWith({
      body: {
        moduleIds: mockModules.map((m) => m.id),
        redirectUrl: `${window.location.origin}${ADMIN_MODULES_PAYMENTS}?clearCart=1`,
      },
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(paymentUrl);
    });
  });

  it('disables pay button while payment is processing', () => {
    (useCart as jest.Mock).mockReturnValue({
      state: { modules: mockModules },
      totalAmount: () => 300,
    });

    (useAxios as jest.Mock).mockReturnValue({
      call: mockAxiosCall,
      performing: true,
    });

    render(<Cart />);

    const payButton = screen.getByText(mockTranslations.pay);
    expect(payButton).toBeDisabled();
  });

  it('formats total price correctly', () => {
    (useCart as jest.Mock).mockReturnValue({
      state: { modules: mockModules },
      totalAmount: () => 1234.56,
    });

    render(<Cart />);

    expect(screen.getByText('€ 1.234,56')).toBeInTheDocument();
  });
});
