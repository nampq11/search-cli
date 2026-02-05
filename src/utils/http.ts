import axios, { type AxiosResponse } from 'axios';
import type { RequestOptions } from '../types/index.js';

/**
 * Default timeout for HTTP requests (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * User-Agent matching the Python reference
 */
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Default headers for all requests
 */
const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent': DEFAULT_USER_AGENT,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

/**
 * HTTP client wrapper for making requests
 */
export class HttpClient {
  /**
   * Perform a GET request
   */
  async get(
    url: string,
    options: RequestOptions = {}
  ): Promise<{
    data: string;
    status: number;
    headers: Record<string, string>;
    cookies?: string;
  }> {
    const headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };

    if (options.cookie) {
      headers.Cookie = options.cookie;
    }

    const response: AxiosResponse<string> = await axios.get(url, {
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      headers,
      responseType: 'text',
      transformResponse: [(data) => data], // Keep as text
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    // Extract cookies from response
    const setCookieHeader = response.headers['set-cookie'];
    let cookies: string | undefined;
    if (setCookieHeader) {
      cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader.map((c) => String(c).split(';')[0]).join('; ')
        : String(setCookieHeader).split(';')[0];
    }

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
      cookies,
    };
  }

  /**
   * Perform a POST request with form data
   */
  async post(
    url: string,
    data: Record<string, string>,
    options: RequestOptions = {}
  ): Promise<{
    data: string;
    status: number;
    headers: Record<string, string>;
  }> {
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    const headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...options.headers,
    };

    if (options.cookie) {
      headers.Cookie = options.cookie;
    }

    const response: AxiosResponse<string> = await axios.post(url, formData as any, {
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      headers,
      responseType: 'text',
      transformResponse: [(data) => data], // Keep as text
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }
}

/**
 * Singleton HTTP client instance
 */
export const httpClient = new HttpClient();
