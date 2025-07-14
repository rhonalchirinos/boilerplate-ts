import { BusinessExceptionFilter } from './business-exception.filter';
import { UnAuthorizedException } from '@core/user/domain/exceptions/un-authorized.exception';
import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

jest.mock('express', () => ({
  Response: jest.fn().mockImplementation(() => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  })),
}));

jest.mock('@nestjs/common', () => ({
  ArgumentsHost: jest.fn().mockImplementation(() => ({
    switchToHttp: jest.fn().mockReturnThis(),
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

  it('should handle UnAuthorizedException and return 401', () => {
    const exception = new UnAuthorizedException('Unauthorized!');

    filter.catch(exception, mockHost);
    const statusSpyOn = jest.spyOn(mockResponse, 'status');
    const jsonSpyOn = jest.spyOn(mockResponse, 'json');

    expect(statusSpyOn).toHaveBeenCalledWith(401);
    expect(jsonSpyOn).toHaveBeenCalledWith({ message: 'Unauthorized!' });
  });

  it('should rethrow non-UnAuthorizedException', () => {
    const exception = new Error('Other error');
    expect(() => filter.catch(exception, mockHost)).toThrow(exception);
  });
});
