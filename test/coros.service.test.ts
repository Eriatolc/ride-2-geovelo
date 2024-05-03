// src/services/coros.service.test.ts
import { CorosService } from '../src/services/coros.service';
import axios from 'axios';

jest.mock('axios');

describe('CorosService', () => {
  let corosService: CorosService;

  beforeEach(() => {
    corosService = new CorosService();
  });

  it('should authenticate with Coros', async () => {
    // Mock successful authentication response
    const mockResponse = { data: { data: { accessToken: 'mockAccessToken' } } };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    await corosService.authenticate();

    expect(corosService['accessToken']).toEqual('mockAccessToken');
  });

  // Write more test cases for other methods if needed
});
