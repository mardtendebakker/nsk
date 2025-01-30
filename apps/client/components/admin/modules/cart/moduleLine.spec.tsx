import { render, screen, fireEvent } from '@testing-library/react';
import ModuleLine from './moduleLine';
import useTranslation from '../../../../hooks/useTranslation';
import useCart from '../../../../hooks/useCart';

jest.mock('../../../../hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../hooks/useCart', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../confirmationDialog', () => ({
  __esModule: true,
  default: function MockConfirmationDialog({ onConfirm, onClose }) {
    return (
      <div data-testid="confirmation-dialog">
        <button onClick={onConfirm} data-testid="confirm-button" type="button">Confirm</button>
        <button onClick={onClose} data-testid="cancel-button" type="button">Cancel</button>
      </div>
    );
  },
}));

describe('ModuleLine Component', () => {
  const mockModule = {
    id: 1,
    name: 'Test Module',
    price: 99.99,
  };

  const mockTranslations = {
    removeModule: 'Remove Module',
    removeModuleConfirmation: 'Are you sure?',
    remove: 'Remove',
  };

  const mockRemoveModule = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
      trans: (key: string) => mockTranslations[key],
    });

    (useCart as jest.Mock).mockReturnValue({
      removeModule: mockRemoveModule,
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ModuleLine module={mockModule} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders module information correctly', () => {
    render(<ModuleLine module={mockModule} />);

    expect(screen.getByText(mockModule.name)).toBeInTheDocument();
    expect(screen.getByText('€ 99,99')).toBeInTheDocument();
    expect(screen.getByText(mockTranslations.remove)).toBeInTheDocument();
  });

  it('shows confirmation dialog when remove is clicked', () => {
    render(<ModuleLine module={mockModule} />);

    fireEvent.click(screen.getByText(mockTranslations.remove));
    expect(screen.getByTestId('confirmation-dialog')).toBeInTheDocument();
  });

  it('closes dialog without removing module when cancelled', () => {
    render(<ModuleLine module={mockModule} />);

    fireEvent.click(screen.getByText(mockTranslations.remove));
    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(mockRemoveModule).not.toHaveBeenCalled();
  });
});
