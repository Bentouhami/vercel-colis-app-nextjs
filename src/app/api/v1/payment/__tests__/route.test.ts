
// src/app/api/v1/payment/__tests__/route.test.ts

import { POST } from '../route';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Mock the Stripe library
const mockCreate = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      checkout: {
        sessions: {
          create: mockCreate,
        },
      },
    };
  });
});

// Mock constants
jest.mock('@/utils/constants', () => ({
  successUrl: 'http://localhost/success',
  cancelUrl: 'http://localhost/cancel',
}));

describe('POST /api/v1/payment', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should create a Stripe session and return its ID on success', async () => {
    // Arrange
    const requestBody = { amount: 42.50 };
    const mockRequest = {
      json: jest.fn().mockResolvedValue(requestBody),
    } as unknown as Request;

    const mockSession = { id: 'sess_12345' };
    mockCreate.mockResolvedValue(mockSession);

    // Act
    const response = await POST(mockRequest);
    const responseBody = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ id: mockSession.id });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Envoi de colis' },
            unit_amount: 4250, // 42.50 * 100
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost/success',
      cancel_url: 'http://localhost/cancel',
    });
  });

  it('should return a 500 error if Stripe session creation fails', async () => {
    // Arrange
    const requestBody = { amount: 42.50 };
    const mockRequest = {
      json: jest.fn().mockResolvedValue(requestBody),
    } as unknown as Request;

    const stripeError = new Error('Stripe API is down');
    mockCreate.mockRejectedValue(stripeError);

    // Act
    const response = await POST(mockRequest);

    // Assert
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('Erreur de paiement');
  });

  it('should return a 500 error if the request body is invalid', async () => {
    // Arrange
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as Request;

    // Act
    const response = await POST(mockRequest);

    // Assert
    expect(response.status).toBe(500);
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
