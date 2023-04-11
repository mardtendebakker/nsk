import { render } from '@testing-library/react';
import { Box, BoxProps } from '@mui/material';
import BorderedBox from './borderedBox';

jest.mock('@mui/material/Box', () => jest.fn(() => null));

describe('BorderedBox', () => {
  const props: BoxProps = {
    sx: {
      border: jest.fn(),
      borderRadius: '0.5rem',
      bgcolor: 'red',
      legend: { display: 'none' },
      px: '.5rem',
    },
  };

  it('matches snapshot', () => {
    const { asFragment } = render(<BorderedBox {...props}><b>test</b></BorderedBox>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('passes props to BaseBorderedBox', () => {
    render(<BorderedBox {...props}><b>test</b></BorderedBox>);

    expect(Box).toBeCalledWith({ children: <b>test</b>, ...props }, {});
  });
});
