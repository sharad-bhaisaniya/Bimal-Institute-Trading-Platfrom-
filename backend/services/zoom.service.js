const axios = require('axios');
const jwt = require('jsonwebtoken');
const ZoomSetting = require('../models/ZoomSetting');

class ZoomService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

  /**
   * Fetches the active Zoom settings from the DB.
   */
  async getCredentials() {
    const credentials = await ZoomSetting.findOne({ isActive: true });
    if (!credentials) {
      throw new Error('No active Zoom credentials found in settings. Please configure them in Settings -> Credentials first.');
    }
    return credentials;
  }

  /**
   * Generates or returns a cached Server-to-Server OAuth Access Token.
   */
  async getAccessToken() {
    // If token exists and is valid (with 5 min buffer), return it
    if (this.accessToken && this.tokenExpiresAt && this.tokenExpiresAt > Date.now() + 300000) {
      return this.accessToken;
    }

    const credentials = await this.getCredentials();
    
    if (credentials.credentialType !== 'Normal') {
        // Technically SDK credentials could also use S2S OAuth if configured properly,
        // but we assume accountId, clientId, clientSecret are populated.
    }

    const { accountId, clientId, clientSecret } = credentials;

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
        {},
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Expires_in is in seconds, we store exact MS time
      this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Zoom S2S OAuth Error:', error.response?.data || error.message);
      const msg = error.response?.data?.reason || error.response?.data?.error || 'Check your Zoom Client ID and Secret in Settings.';
      throw new Error(`Failed to generate Zoom Access Token: ${msg}`);
    }
  }

  /**
   * Creates a meeting using the Zoom API
   * @param {Object} data Meeting options (topic, type, start_time, duration, etc.)
   * @returns {Object} Meeting details from Zoom
   */
  async createMeeting(data) {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Zoom Create Meeting Error:', error.response?.data || error.message);
      const msg = error.response?.data?.message || error.message;
      throw new Error(`Failed to create Zoom meeting: ${msg}`);
    }
  }

  /**
   * Generates a cryptographic SDK JWT signature required by the Zoom Meeting SDK.
   * @param {String} meetingNumber Zoom Meeting Number
   * @param {Number} role 0 for participant, 1 for host
   */
  async generateSdkSignature(meetingNumber, role = 0) {
    const credentials = await this.getCredentials();
    
    // Zoom Meeting SDK uses SDK Key and SDK Secret
    const sdkKey = credentials.sdkKey || credentials.clientId;
    const sdkSecret = credentials.sdkSecret || credentials.clientSecret;

    if (!sdkKey || !sdkSecret) {
      throw new Error('Zoom SDK Key or Secret is missing in settings');
    }

    const iat = Math.round((new Date().getTime() - 30000) / 1000);
    const exp = iat + 60 * 60 * 2; // Token valid for 2 hours

    // Remove spaces from meeting number in case it is formatted like '123 456 7890'
    const cleanMeetingNumber = meetingNumber.toString().replace(/\s/g, '');

    const payload = {
      appKey: sdkKey, // zoom recommends using appKey instead of sdkKey
      mn: Number(cleanMeetingNumber),
      role: Number(role),
      iat: iat,
      exp: exp,
      tokenExp: exp
    };

    const signature = jwt.sign(payload, sdkSecret, { algorithm: 'HS256', header: { alg: 'HS256', typ: 'JWT' } });
    return signature;
  }
}

module.exports = new ZoomService();
