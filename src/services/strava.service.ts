// services/strava.service.ts
import axios from 'axios';
// import { StreamActivity } from 'gpx-converter'; // Replace with the actual library

export class StravaService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor(clientId: string, clientSecret: string, accessToken: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = accessToken;
  }

  private async authenticate(code: string): Promise<void> {
    try {
      const response = await axios.post(
        'https://www.strava.com/oauth/token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
        },
      );

      this.accessToken = response.data.access_token;
    } catch (error) {
      console.log('Strava authentication error:', error)
      // if (hasMessage(error)) throw new Error(`Strava authentication error: ${error.message}`);
    }
  }

  public async getActivities(): Promise<any[]> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Strava. Please authenticate first.');
    }

    try {
      const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      return response.data;
    } catch (error) {
      console.log('Strava authentication error:', error)
      return []
      // throw new Error(`Error fetching Strava activities: ${error.message}`);
    }
  }

  private async extractStream(activityId: number): Promise<Boolean> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Strava. Please authenticate first.');
    }

    try {
      const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}/streams/latlng`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      // Assume that the hypothetical library provides a function to convert stream data to GPX
      // return gpxConverter.convert(response.data);
      return true;
    } catch (error) {
      console.log('Strava authentication error:', error)
      return false
      // throw new Error(`Error extracting Strava stream for activity ${activityId}: ${error.message}`);
    }
  }

  public async authenticateAndExtractActivities(code: string): Promise<any[]> {
    await this.authenticate(code);

    const activities = await this.getActivities();

    const streamActivities = [];

    for (const activity of activities) {
      const streamActivity = await this.extractStream(activity.id);
      streamActivities.push(streamActivity);
    }

    return streamActivities;
  }
}
