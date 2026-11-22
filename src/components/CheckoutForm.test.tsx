import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CheckoutForm from './CheckoutForm';

describe('Checkout validation', () => {
  it('renders field-level errors and blocks empty or invalid orders', () => {
    const onValidSubmit = vi.fn();
    render(<CheckoutForm onValidSubmit={onValidSubmit}/>);
    fireEvent.click(screen.getByRole('button', { name: /place demo order/i }));
    expect(screen.getByText('Please enter your full name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Please enter your street address.')).toBeInTheDocument();
    expect(onValidSubmit).not.toHaveBeenCalled();
  });
});
