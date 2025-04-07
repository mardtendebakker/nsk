import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import ListContainer from '.';
import useAxios from '../../../../../hooks/useAxios';
import useTranslation from '../../../../../hooks/useTranslation';
import { PAYMENTS_FREE_TRIAL_PATH, MODULES_PATH, MODULES_CONFIGS_PATH } from '../../../../../utils/axios';

jest.mock('../../../../../hooks/useAxios', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../../hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./list', () => ({
  __esModule: true,
  default: function MockList({
    modules, onFreeTrial, onSettings, disabled,
  }) {
    return (
      <div data-testid="mock-list">
        {modules.map((module) => (
          <div key={module.id} data-testid={`module-${module.id}`}>
            <button onClick={() => onFreeTrial(module)} disabled={disabled} data-testid={`free-trial-${module.id}`} type="button">
              Free Trial
            </button>
            <button onClick={() => onSettings(module)} disabled={disabled} data-testid={`settings-${module.id}`} type="button">
              Settings
            </button>
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock('./settingsModal', () => ({
  __esModule: true,
  default: function MockSettingsModal({ onSubmit, onClose, disabled }) {
    return (
      <div data-testid="settings-modal">
        <button onClick={() => onSubmit({ config: 'test' })} disabled={disabled} data-testid="submit-settings" type="button">
          Submit
        </button>
        <button onClick={onClose} data-testid="close-modal" type="button">Close</button>
      </div>
    );
  },
}));

describe('ListContainer Component', () => {
  const mockModules = [
    { id: 1, name: 'Module 1' },
    { id: 2, name: 'Module 2' },
  ];

  const mockAxiosCall = jest.fn();
  const mockFreeTrialCall = jest.fn();
  const mockConfigCall = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
      trans: (key: string) => key,
    });

    (useAxios as jest.Mock)
      .mockImplementation((method, path) => {
        if (path === MODULES_PATH.replace(':id', '')) {
          return {
            data: mockModules,
            call: mockAxiosCall,
            performing: false,
          };
        }
        if (path === PAYMENTS_FREE_TRIAL_PATH.replace(':moduleName', '')) {
          return {
            call: mockFreeTrialCall,
            performing: false,
          };
        }
        if (path === MODULES_CONFIGS_PATH.replace(':moduleName', '')) {
          return {
            call: mockConfigCall,
            performing: false,
          };
        }
      });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ListContainer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches and renders modules on mount', () => {
    render(<ListContainer />);

    expect(mockAxiosCall).toHaveBeenCalled();
    expect(screen.getByTestId('mock-list')).toBeInTheDocument();
    mockModules.forEach((module) => {
      expect(screen.getByTestId(`module-${module.id}`)).toBeInTheDocument();
    });
  });

  it('handles free trial activation', async () => {
    render(<ListContainer />);

    fireEvent.click(screen.getByTestId('free-trial-1'));

    expect(mockFreeTrialCall).toHaveBeenCalledWith({
      path: PAYMENTS_FREE_TRIAL_PATH.replace(':id', '1'),
    });

    await waitFor(() => {
      expect(mockAxiosCall).toHaveBeenCalledTimes(2);
    });
  });

  it('handles settings modal interactions', async () => {
    render(<ListContainer />);

    fireEvent.click(screen.getByTestId('settings-1'));
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('submit-settings'));

    expect(mockConfigCall).toHaveBeenCalledWith({
      path: MODULES_CONFIGS_PATH.replace(':id', '1'),
      body: { config: 'test' },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
      expect(mockAxiosCall).toHaveBeenCalledTimes(2);
    });
  });

  it('closes settings modal without submitting', () => {
    render(<ListContainer />);

    fireEvent.click(screen.getByTestId('settings-1'));
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
    expect(mockConfigCall).not.toHaveBeenCalled();
  });

  it('disables interactions while performing operations', () => {
    (useAxios as jest.Mock)
      .mockImplementation((method, path) => {
        if (path === MODULES_PATH.replace(':id', '')) {
          return {
            data: mockModules,
            call: mockAxiosCall,
            performing: true,
          };
        }
        return {
          call: jest.fn(),
          performing: false,
        };
      });

    render(<ListContainer />);

    mockModules.forEach((module) => {
      expect(screen.getByTestId(`free-trial-${module.id}`)).toBeDisabled();
      expect(screen.getByTestId(`settings-${module.id}`)).toBeDisabled();
    });
  });
});
