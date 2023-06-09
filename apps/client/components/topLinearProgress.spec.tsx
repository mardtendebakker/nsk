import { render } from '@testing-library/react';
import { LinearProgress } from '@mui/material';
import TopLinearProgress, { hideProgress, showProgress } from './topLinearProgress';

jest.mock('@mui/material/LinearProgress', () => jest.fn(({ id }) => <div id={id} />));

describe('TopLinearProgress', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<TopLinearProgress />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with correct props', () => {
    render(<TopLinearProgress />);

    expect(LinearProgress).toBeCalledWith({
      sx: {
        position: 'fixed',
        display: 'none',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1202,
      },
      color: 'secondary',
      id: 'progress',
    }, {});
  });

  it('shows progress', () => {
    const { container } = render(<TopLinearProgress />);
    showProgress();
    const element = container.querySelector('#progress');

    expect(element.getAttribute('style')).toBe('display: unset;');
  });

  it('hides progress', () => {
    const { container } = render(<TopLinearProgress />);
    hideProgress();
    const element = container.querySelector('#progress');

    expect(element.getAttribute('style')).toBe('display: none;');
  });
});
