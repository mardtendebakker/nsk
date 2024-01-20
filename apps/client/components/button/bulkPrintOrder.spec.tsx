import { fireEvent, render, waitFor } from '@testing-library/react';
import BulkPrintOrder from './bulkPrintOrder';

const mockAxios = {
  call: jest.fn(() => Promise.resolve({ data: 'data' })),
};

jest.mock('../../hooks/useAxios', () => () => mockAxios);
jest.mock('../../utils/blob', () => ({
  openBlob: jest.fn(),
}));

describe('bulkPrint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('tooltip mode', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<BulkPrintOrder onPerforming={() => {}} type="purchase" ids={['1']} />);
      expect(asFragment()).toMatchSnapshot();
    });
    it('handles click', async () => {
      const onPerforming = jest.fn();
      const { getByRole } = render(<BulkPrintOrder onPerforming={onPerforming} type="purchase" ids={['1']} />);
      await waitFor(() => { fireEvent.click(getByRole('button')); });

      expect(mockAxios.call).toHaveBeenCalled();
      expect(onPerforming).toHaveBeenCalledWith(true);
      expect(onPerforming).toHaveBeenCalledWith(false);
    });
    it('disables click', async () => {
      const onPerforming = jest.fn();
      const { getByRole } = render(<BulkPrintOrder onPerforming={onPerforming} type="purchase" ids={['1']} disabled />);
      await waitFor(() => { fireEvent.click(getByRole('button')); });

      expect(mockAxios.call).not.toHaveBeenCalled();
      expect(onPerforming).not.toHaveBeenCalled();
    });
  });
});
