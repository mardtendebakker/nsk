import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsModal from './settingsModal';

// Define the ModuleListItem type
interface ModuleListItem {
  id: number;
  name: string;
  active: boolean;
  price: number;
  freeTrialUsed: boolean;
  config: {
    [key: string]: {
      value?: string | string[];
      required?: boolean;
      type: 'string' | 'hour' | 'multiSelect' | 'password';
      options?: string[];
    };
  };
  activeAt?: string;
  expiresAt?: string;
}

// Mock the imported components and hooks
jest.mock('@mui/material', () => ({
  Autocomplete: jest.fn(({
    value, onChange, disabled,
  }) => (
    <input
      data-testid="autocomplete-input"
      value={value}
      onChange={(e) => onChange(e, e.target.value.split(','))}
      disabled={disabled}
    />
  )),
  Chip: jest.fn(({ label }) => <div data-testid="mock-chip">{label}</div>),
  Box: jest.fn(({ children }) => <div data-testid="mock-box">{children}</div>),
}));

jest.mock('../../../../confirmationDialog', () => ({
  __esModule: true,
  default: function MockConfirmationDialog({ onConfirm, onClose, content }) {
    return (
      <div data-testid="confirmation-dialog">
        {content}
        <button onClick={onConfirm} data-testid="confirm-button" type="button">Confirm</button>
        <button onClick={onClose} data-testid="cancel-button" type="button">Cancel</button>
      </div>
    );
  },
}));

jest.mock('@mui/x-date-pickers', () => ({
  TimePicker: jest.fn(({
    value, onChange, disabled,
  }) => (
    <input
      data-testid="timepicker-input"
      type="text"
      value={value}
      onChange={(e) => {
        onChange({ getHours: () => e.target.value });
      }}
      disabled={disabled}
    />
  )),
}));

jest.mock('../../../../memoizedInput/textField', () => ({
  __esModule: true,
  default: jest.fn(({
    value, onChange, disabled,
  }) => (
    <input
      data-testid="mock-textfield"
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )),
}));

jest.mock('../../../../memoizedInput/sensitiveTextField', () => ({
  __esModule: true,
  default: jest.fn(({
    value, onChange, disabled,
  }) => (
    <input
      data-testid="mock-sensitive-textfield"
      type="password"
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )),
}));

jest.mock('../../../../input/textField', () => ({
  __esModule: true,
  default: jest.fn(({
    value, onChange, disabled,
  }) => (
    <input
      data-testid="mock-base-textfield"
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )),
}));

describe('SettingsModal', () => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2020-01-01'));
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const mockModule: ModuleListItem = {
    id: 1,
    name: 'Test Module',
    active: true,
    price: 99.99,
    freeTrialUsed: false,
    config: {
      stringField: {
        type: 'string',
        value: 'initial text',
        required: true,
      },
      passwordField: {
        type: 'password',
        value: 'secret',
        required: true,
      },
      multiSelectField: {
        type: 'multiSelect',
        value: ['option1', 'option2'],
        options: ['option1', 'option2', 'option3'],
        required: true,
      },
      hourField: {
        type: 'hour',
        value: '14',
        required: true,
      },
    },
    activeAt: '2024-01-01T00:00:00Z',
    expiresAt: '2025-01-01T00:00:00Z',
  };

  const defaultProps = {
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    disabled: false,
    module: mockModule,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<SettingsModal {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders all form fields with initial values', () => {
    render(<SettingsModal {...defaultProps} />);

    expect(screen.getByTestId('mock-textfield')).toHaveValue('initial text');
    expect(screen.getByTestId('mock-sensitive-textfield')).toHaveValue('secret');
    expect(screen.getByTestId('autocomplete-input')).toBeInTheDocument();
    expect(screen.getByTestId('timepicker-input')).toBeInTheDocument();
  });

  it('handles text field changes', async () => {
    render(<SettingsModal {...defaultProps} />);

    const textField = screen.getByTestId('mock-textfield');
    fireEvent.change(textField, { target: { value: 'new text' } });

    await waitFor(() => {
      expect(textField).toHaveValue('new text');
    });
  });

  it('handles password field changes', async () => {
    render(<SettingsModal {...defaultProps} />);

    const passwordField = screen.getByTestId('mock-sensitive-textfield');
    fireEvent.change(passwordField, { target: { value: 'new password' } });

    await waitFor(() => {
      expect(passwordField).toHaveValue('new password');
    });
  });

  it('handles multi-select changes', async () => {
    render(<SettingsModal {...defaultProps} />);

    const autocomplete = screen.getByTestId('autocomplete-input');
    fireEvent.change(autocomplete, { target: { value: 'option1,option3' } });

    await waitFor(() => {
      expect(autocomplete).toBeInTheDocument();
    });
  });

  it('handles hour picker changes', async () => {
    render(<SettingsModal {...defaultProps} />);

    const timePicker = screen.getByTestId('timepicker-input');
    fireEvent.change(timePicker, { target: { value: '16' } });

    await waitFor(() => {
      expect((timePicker as unknown as { value: string }).value.includes('16')).toBe(true);
    });
  });

  it('handles form submission with correct config format', async () => {
    render(<SettingsModal {...defaultProps} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        stringField: 'initial text',
        passwordField: 'secret',
        multiSelectField: ['option1', 'option2'],
        hourField: '14',
      });
    });
  });

  it('handles required field validation', async () => {
    const moduleWithEmptyRequired = {
      ...mockModule,
      config: {
        ...mockModule.config,
        stringField: {
          ...mockModule.config.stringField,
          value: '',
        },
      },
    };

    render(<SettingsModal {...defaultProps} module={moduleWithEmptyRequired} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('disables all inputs when disabled prop is true', () => {
    render(<SettingsModal {...defaultProps} disabled />);

    expect(screen.getByTestId('mock-textfield')).toHaveAttribute('disabled');
    expect(screen.getByTestId('mock-sensitive-textfield')).toHaveAttribute('disabled');
    expect(screen.getByTestId('autocomplete-input')).toHaveAttribute('disabled');
    expect(screen.getByTestId('timepicker-input')).toHaveAttribute('disabled');
  });

  it('calls onClose when close button is clicked', () => {
    render(<SettingsModal {...defaultProps} />);

    const closeButton = screen.getByTestId('cancel-button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
