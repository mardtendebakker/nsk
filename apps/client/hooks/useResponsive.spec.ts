import { renderHook } from '@testing-library/react';
import useMediaQuery from '@mui/material/useMediaQuery';
import useResponsive from './useResponsive';

jest.mock('@mui/material/useMediaQuery');
jest.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    breakpoints: {
      up: jest.fn(),
      down: jest.fn(),
      between: jest.fn(),
      only: jest.fn(),
    },
  }),
}));

describe('useResponsive', () => {
  it('should return true for media queries up to the given breakpoint', () => {
    useMediaQuery.mockReturnValue(true);
    const { result } = renderHook(() => useResponsive('up', 'md'));
    expect(result.current).toBe(true);
  });

  it('should return true for media queries down to the given breakpoint', () => {
    useMediaQuery.mockReturnValue(true);
    const { result } = renderHook(() => useResponsive('down', 'md'));
    expect(result.current).toBe(true);
  });

  it('should return true for media queries between the given breakpoints', () => {
    useMediaQuery.mockReturnValue(true);
    const { result } = renderHook(() => useResponsive('between', 'sm', 'md'));
    expect(result.current).toBe(true);
  });

  it('should return false for wrong query value', () => {
    const { result } = renderHook(() => useResponsive(undefined));
    expect(result.current).toBe(false);
  });
});
