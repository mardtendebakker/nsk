/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsContainer from './settingsContainer';

jest.mock('@mui/material', () => ({
  Box: ({ children }) => <div data-testid="box">{children}</div>,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
}));

jest.mock('./menu', () => ({
  __esModule: true,
  default: () => <div data-testid="menu">Menu Component</div>,
}));

describe('SettingsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    function TestChild() {
      return <div>Test Child Content</div>;
    }
    const { asFragment } = render(<SettingsContainer><TestChild /></SettingsContainer>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the container with all components', () => {
    function TestChild() {
      return <div>Test Child Content</div>;
    }
    render(<SettingsContainer><TestChild /></SettingsContainer>);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('box')).toHaveLength(2);
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    function TestChild() {
      return <div>Test Child Content</div>;
    }
    render(<SettingsContainer><TestChild /></SettingsContainer>);

    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('renders the menu component', () => {
    function TestChild() {
      return <div>Test Child Content</div>;
    }
    render(<SettingsContainer><TestChild /></SettingsContainer>);

    expect(screen.getByText('Menu Component')).toBeInTheDocument();
  });
});
