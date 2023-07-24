import { render } from '@testing-library/react';
import { TextField as BaseTextField, TextFieldProps } from '@mui/material';
import TextField from './textField';

jest.mock('@mui/material/TextField', () => jest.fn(() => null));

describe('TextField', () => {
  const props: TextFieldProps = {
    InputLabelProps: {
      shrink: true,
      sx: {
        mb: '.5rem',
        position: 'relative',
        transform: 'unset',
      },
    },
    error: true,
    helperText: 'helper',
    label: 'label',
    name: 'name',
    onChange: () => {},
    placeholder: 'placeholder',
    size: 'medium',
    sx: {
      bgcolor: 'red',
      legend: { width: 0 },
    },
    value: 'value',
    about: 'about',
  };

  it('matches snapshot', () => {
    const { asFragment } = render(<TextField {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('passes props to BaseTextField', () => {
    render(<TextField {...props} />);

    expect(BaseTextField).toBeCalledWith(props, {});
  });
});
