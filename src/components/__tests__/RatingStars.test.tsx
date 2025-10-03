// components/__tests__/RatingStars.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingStars } from '../RatingStars';

describe('RatingStars', () => {
  test('renders correct number of stars', () => {
    render(<RatingStars value={3} readOnly />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });

  test('calls onChange when star is clicked', () => {
    const handleChange = jest.fn();
    render(<RatingStars value={0} onChange={handleChange} />);
    
    const thirdStar = screen.getByLabelText('3 Stars');
    fireEvent.click(thirdStar);
    
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  test('does not call onChange when readOnly', () => {
    const handleChange = jest.fn();
    render(<RatingStars value={3} readOnly onChange={handleChange} />);
    
    const stars = screen.getAllByRole('button');
    stars.forEach(star => {
      fireEvent.click(star);
    });
    
    expect(handleChange).not.toHaveBeenCalled();
  });
});