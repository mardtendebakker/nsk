import { render, screen, fireEvent } from '@testing-library/react';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';
import useCart from '../../../../../hooks/useCart';
import { ModuleListItem } from '../../../../../utils/axios/models/module';

jest.mock('../../../../../hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../../hooks/useCart', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../tableCell', () => ({
  __esModule: true,
  default: ({ children }) => <td>{children}</td>,
}));

describe('List Component', () => {
  const mockModules: ModuleListItem[] = [
    {
      id: 1,
      name: 'Basic Module',
      price: 99.99,
      active: false,
      freeTrialUsed: false,
      config: {
        apiKey: {
          value: null,
          required: true,
          type: 'password',
        },
        schedule: {
          value: '09:00',
          required: true,
          type: 'hour',
        },
      },
      activeAt: '2024-01-01T00:00:00Z',
      expiresAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Advanced Module',
      price: 149.99,
      active: true,
      freeTrialUsed: true,
      config: {
        mode: {
          value: 'standard',
          required: true,
          type: 'string',
          options: ['standard', 'advanced', 'expert'],
        },
        notifications: {
          value: ['email', 'sms'],
          required: false,
          type: 'multiSelect',
          options: ['email', 'sms', 'push'],
        },
      },
      activeAt: '2024-02-01T00:00:00Z',
      expiresAt: null,
    },
    {
      id: 3,
      name: 'Simple Module',
      price: 49.99,
      active: false,
      freeTrialUsed: false,
      config: null,
      activeAt: null,
      expiresAt: null,
    },
  ];

  const mockTranslations = {
    name: 'Name',
    price: 'Price',
    activeAt: 'Active At',
    expiresAt: 'Expires At',
    active: 'Active',
    actions: 'Actions',
  };

  const mockAddModule = jest.fn();
  const mockOnFreeTrial = jest.fn();
  const mockOnSettings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
      trans: (key: string) => mockTranslations[key],
    });

    (useCart as jest.Mock).mockReturnValue({
      addModule: mockAddModule,
      state: { modules: [] },
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<List modules={mockModules} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders table headers correctly', () => {
    render(<List modules={[]} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    Object.values(mockTranslations).forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders module rows with correct data', () => {
    render(<List modules={mockModules} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    mockModules.forEach((module) => {
      expect(screen.getByText(module.name)).toBeInTheDocument();
      if (module.active) {
        expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
      }
    });
  });

  it('handles modules with missing required config', () => {
    const moduleWithMissingConfig: ModuleListItem = {
      ...mockModules[0],
      config: {
        apiKey: {
          value: null,
          required: true,
          type: 'password',
        },
      },
    };

    render(<List modules={[moduleWithMissingConfig]} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    const addToCartButton = screen.getAllByRole('button')[0];
    const freeTrialButton = screen.getAllByRole('button')[1];

    expect(addToCartButton).toBeDisabled();
    expect(freeTrialButton).toBeDisabled();
  });

  it('enables actions when all required configs are set', () => {
    const moduleWithCompleteConfig: ModuleListItem = {
      ...mockModules[0],
      config: {
        apiKey: {
          value: 'secret-key',
          required: true,
          type: 'password',
        },
      },
    };

    render(<List modules={[moduleWithCompleteConfig]} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    const addToCartButton = screen.getAllByRole('button')[0];
    const freeTrialButton = screen.getAllByRole('button')[1];

    expect(addToCartButton).not.toBeDisabled();
    expect(freeTrialButton).not.toBeDisabled();
  });

  it('renders settings button only for modules with config', () => {
    render(<List modules={mockModules} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    mockModules.forEach((module, index) => {
      const buttons = screen.getAllByRole('button');
      const hasSettingsButton = module.config !== null;
      const settingsButtonIndex = index * 3 + 2;

      if (hasSettingsButton) {
        expect(buttons[settingsButtonIndex]).toBeInTheDocument();
      }
    });
  });

  it('handles add to cart for module without config', () => {
    const simpleModule = mockModules[2];
    render(<List modules={[simpleModule]} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    const addToCartButton = screen.getAllByRole('button')[0];
    fireEvent.click(addToCartButton);

    expect(mockAddModule).toHaveBeenCalledWith({
      id: simpleModule.id,
      name: simpleModule.name,
      price: simpleModule.price,
    });
  });

  it('disables actions when module is in cart', () => {
    (useCart as jest.Mock).mockReturnValue({
      addModule: mockAddModule,
      state: { modules: [{ name: mockModules[0].name }] },
    });

    render(<List modules={[mockModules[0]]} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it('handles multiSelect config type correctly', () => {
    const moduleWithMultiSelect = mockModules[1];
    render(<List modules={[moduleWithMultiSelect]} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    const settingsButton = screen.getAllByRole('button')[2];
    fireEvent.click(settingsButton);

    expect(mockOnSettings).toHaveBeenCalledWith(moduleWithMultiSelect);
  });

  it('formats dates correctly', () => {
    render(<List modules={[mockModules[0]]} disabled={false} onFreeTrial={mockOnFreeTrial} onSettings={mockOnSettings} />);

    expect(screen.getByText('2024/01/01')).toBeInTheDocument();
    expect(screen.getByText('2025/01/01')).toBeInTheDocument();
  });
});
