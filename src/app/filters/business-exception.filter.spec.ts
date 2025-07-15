import { BusinessExceptionFilter } from './business-exception.filter';
import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

jest.mock('express', () => ({
  Response: jest.fn().mockImplementation(() => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  })),
}));

describe('BusinessExceptionFilter', () => {
  let filter: BusinessExceptionFilter;
  let mockHost: ArgumentsHost;
  let mockResponse: jest.Mocked<Response>;

  beforeEach(() => {
    filter = new BusinessExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as jest.Mocked<Response>;

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle InvalidCredentialsException and return 401', () => {
    const exception = new InvalidCredentialsException('Unauthorized!');
    const statusSpyOn = jest.spyOn(mockResponse, 'status');
    const jsonSpyOn = jest.spyOn(mockResponse, 'json');

    filter.catch(exception, mockHost);
    expect(statusSpyOn).toHaveBeenCalledWith(401);
    expect(jsonSpyOn).toHaveBeenCalledWith({ message: 'Unauthorized!', errors: [] });
  });

  it('should rethrow non-InvalidCredentialsException', () => {
    const exception = new Error('Other error');
    expect(() => filter.catch(exception, mockHost)).toThrow(exception);
  });
});
