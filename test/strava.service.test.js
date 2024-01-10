// services/strava.service.test.ts
import axios from 'axios';
import { StravaService } from './strava.service';

// Mocking Axios for unit testing
jest.mock('axios');

describe('StravaService', () => {
  const clientId = 'YOUR_CLIENT_ID';
  const clientSecret = 'YOUR_CLIENT_SECRET';
  const stravaService = new StravaService(clientId, clientSecret);

  // Mock access token for testing
  const mockAccessToken = 'MOCK_ACCESS_TOKEN';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate and set access token', async () => {
      // Mock Axios post implementation
      axios.post.mockResolvedValueOnce({ data: { access_token: mockAccessToken } });

      const code = 'MOCK_AUTH_CODE';
      await stravaService.authenticate(code);

      expect(axios.post).toHaveBeenCalledWith(
        'https://www.strava.com/oauth/token',
        expect.objectContaining({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
        }),
      );

      expect(stravaService['accessToken']).toBe(mockAccessToken);
    });

    it('should throw an error on authentication failure', async () => {
      // Mock Axios post implementation to simulate an error
      axios.post.mockRejectedValueOnce(new Error('Authentication failed'));

      const code = 'INVALID_AUTH_CODE';
      await expect(stravaService.authenticate(code)).rejects.toThrow(
        'Strava authentication error: Authentication failed',
      );
    });
  });

  describe('getActivities', () => {
    it('should fetch activities with a valid access token', async () => {
      // Set the access token for the service
      stravaService['accessToken'] = mockAccessToken;

      // Mock Axios get implementation
      axios.get.mockResolvedValueOnce({ data: [{ id: 1, type: 'Run' }, { id: 2, type: 'Ride' }] });

      const activities = await stravaService.getActivities();

      expect(axios.get).toHaveBeenCalledWith(
        'https://www.strava.com/api/v3/athlete/activities',
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockAccessToken}` },
        }),
      );

      expect(activities).toEqual([{ id: 1, type: 'Run' }, { id: 2, type: 'Ride' }]);
    });

    it('should throw an error if not authenticated', async () => {
      await expect(stravaService.getActivities()).rejects.toThrow(
        'Not authenticated with Strava. Please authenticate first.',
      );
    });

    it('should throw an error on activity fetch failure', async () => {
      // Set the access token for the service
      stravaService['accessToken'] = mockAccessToken;

      // Mock Axios get implementation to simulate an error
      axios.get.mockRejectedValueOnce(new Error('Failed to fetch activities'));

      await expect(stravaService.getActivities()).rejects.toThrow(
        'Error fetching Strava activities: Failed to fetch activities',
      );
    });
  });

  describe('extractStream', () => {
    it('should extract stream for a valid activity with a valid access token', async () => {
      // Set the access token for the service
      stravaService['accessToken'] = mockAccessToken;

      // Mock Axios get implementation
      axios.get.mockResolvedValueOnce({ data: [{ latlng: [1, 2] }, { latlng: [3, 4] }] });

      // Mock gpxConverter
      const mockGpxConverter = {
        convert: jest.fn((data) => data), // Replace with your actual mock implementation
      };
      jest.mock('gpx-converter', () => ({ convert: mockGpxConverter.convert }));

      const stream = await stravaService.extractStream(123);

      expect(axios.get).toHaveBeenCalledWith(
        'https://www.strava.com/api/v3/activities/123/streams/latlng',
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockAccessToken}` },
        }),
      );

      expect(mockGpxConverter.convert).toHaveBeenCalledWith([{ latlng: [1, 2] }, { latlng: [3, 4] }]);
      expect(stream).toEqual([{ latlng: [1, 2] }, { latlng: [3, 4] }]);
    });

    it('should throw an error if not authenticated', async () => {
      await expect(stravaService.extractStream(123)).rejects.toThrow(
        'Not authenticated with Strava. Please authenticate first.',
      );
    });

    it('should throw an error on stream extraction failure', async () => {
      // Set the access token for the service
      stravaService['accessToken'] = mockAccessToken;

      // Mock Axios get implementation to simulate an error
      axios.get.mockRejectedValueOnce(new Error('Failed to extract stream'));

      await expect(stravaService.extractStream(123)).rejects.toThrow(
        'Error extracting Strava stream for activity 123: Failed to extract stream',
      );
    });
  });

  describe('authenticateAndExtractActivities', () => {
    it('should authenticate, fetch activities, and extract streams', async () => {
      // Mock Axios post implementation
      axios.post.mockResolvedValueOnce({ data: { access_token: mockAccessToken } });

      // Mock Axios get implementation
      axios.get.mockResolvedValueOnce({ data: [{ id: 1, type: 'Run' }, { id: 2, type: 'Ride' }] });

      // Mock Axios get implementation for stream extraction
      axios.get.mockResolvedValueOnce({ data: [{ latlng: [1, 2] }, { latlng: [3, 4] }] });

      // Mock gpxConverter
      const mockGpxConverter = {
        convert: jest.fn((data) => data), // Replace with your actual mock implementation
      };
      jest.mock('gpx-converter', () => ({ convert: mockGpxConverter.convert }));

      const code = 'MOCK_AUTH_CODE';
      const streamActivities = await stravaService.authenticateAndExtractActivities(code);

      expect(streamActivities).toEqual([
        { latlng: [1, 2] }, { latlng: [3, 4] },
      ]);

      expect(mockGpxConverter.convert).toHaveBeenCalledWith([{ latlng: [1, 2] }, { latlng: [3, 4] }]);
    });

    it('should throw an error if authentication fails', async () => {
      // Mock Axios post implementation to simulate an error
      axios.post.mockRejectedValueOnce(new Error('Authentication failed'));

      const code = 'INVALID_AUTH_CODE';
      await expect(stravaService.authenticateAndExtractActivities(code)).rejects.toThrow(
        'Strava authentication error: Authentication failed',
      );
    });
  });
});
