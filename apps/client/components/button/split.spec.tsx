import { fireEvent, render } from '@testing-library/react';
import Split from './split';

describe('split', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Split onClick={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('handles click', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Split onClick={onClick} />);
    fireEvent.click(getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
  it('disables click', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Split onClick={onClick} disabled />);
    fireEvent.click(getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
