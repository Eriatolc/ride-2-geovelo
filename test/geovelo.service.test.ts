// src/services/geovelo.service.test.ts
import { GeoveloService } from '../src/services/geovelo.service';
import axios from 'axios';

jest.mock('axios');

describe('GeoveloService', () => {
  let geoveloService: GeoveloService;

  beforeEach(() => {
    geoveloService = new GeoveloService();
  });

  it('should authenticate with Geovelo', async () => {
    // Mock successful authentication response
    const mockAuthorizationHeader = 'Bearer mockAccessToken';
    const mockResponse = { headers: { authorization: mockAuthorizationHeader } };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    await geoveloService.authenticate();

    expect(geoveloService['accessToken']).toEqual(mockAuthorizationHeader);
  });

  // Write more test cases for other methods if needed
});
