import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShotCalculator } from './index';
import { physicsService } from '../../services/physics-service';

// Mock the physics service
jest.mock('../../services/physics-service', () => ({
  physicsService: {
    calculateShot: jest.fn(),
  },
}));

describe('ShotCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the calculator form with initial values', () => {
    render(<ShotCalculator />);

    expect(screen.getByTestId('distance-input')).toHaveValue(150);
    expect(screen.getByTestId('club-type-select')).toHaveValue('iron7');
    expect(screen.getByTestId('temperature-input')).toHaveValue(70);
  });

  it('updates form values when inputs change', () => {
    render(<ShotCalculator />);

    const distanceInput = screen.getByTestId('distance-input');
    const clubSelect = screen.getByTestId('club-type-select');
    const temperatureInput = screen.getByTestId('temperature-input');

    fireEvent.change(distanceInput, { target: { value: '200' } });
    fireEvent.change(clubSelect, { target: { value: 'driver' } });
    fireEvent.change(temperatureInput, { target: { value: '80' } });

    expect(distanceInput).toHaveValue(200);
    expect(clubSelect).toHaveValue('driver');
    expect(temperatureInput).toHaveValue(80);
  });

  it('calculates shot and displays results', async () => {
    const mockResult = {
      adjustedDistance: 185.5,
      maxHeight: 25.3,
      trajectory: [[0, 0], [50, 10], [100, 15], [150, 10], [185.5, 0]],
    };

    (physicsService.calculateShot as jest.Mock).mockResolvedValueOnce(mockResult);

    const onResultsChange = jest.fn();
    render(<ShotCalculator onResultsChange={onResultsChange} />);

    fireEvent.click(screen.getByTestId('calculate-button'));

    await waitFor(() => {
      expect(screen.getByTestId('results')).toBeInTheDocument();
    });

    expect(screen.getByTestId('adjusted-distance')).toHaveTextContent('185.5');
    expect(screen.getByTestId('max-height')).toHaveTextContent('25.3');
    expect(onResultsChange).toHaveBeenCalledWith(mockResult);
  });

  it('handles calculation errors', async () => {
    const error = new Error('Calculation failed');
    (physicsService.calculateShot as jest.Mock).mockRejectedValueOnce(error);

    const onResultsChange = jest.fn();
    render(<ShotCalculator onResultsChange={onResultsChange} />);

    fireEvent.click(screen.getByTestId('calculate-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error-message')).toHaveTextContent('Calculation failed');
    expect(onResultsChange).toHaveBeenCalledWith(null);
  });

  it('disables calculate button while loading', async () => {
    (physicsService.calculateShot as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ShotCalculator />);
    const calculateButton = screen.getByTestId('calculate-button');

    fireEvent.click(calculateButton);
    expect(calculateButton).toBeDisabled();
    expect(calculateButton).toHaveTextContent('Calculating...');

    await waitFor(() => {
      expect(calculateButton).not.toBeDisabled();
      expect(calculateButton).toHaveTextContent('Calculate Shot');
    });
  });
}); 