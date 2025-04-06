/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiError } from 'next/dist/server/api-utils';

export class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // 共通のヘッダー作成メソッド
  private getHeaders(contentType: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'x-api-key': this.apiKey,
    };

    if (contentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private getApiUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  // GETリクエスト🔍
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `GET request to ${endpoint} failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, `GET request to ${endpoint} failed: ${(error as Error).message}`);
    }
  }

  // POSTリクエスト📝
  async post<T>(endpoint: string, data: any): Promise<T> {
    const apiUrl = this.getApiUrl(`http://localhost:3001/api${endpoint}`);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `POST request to ${apiUrl} failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, `POST request to ${apiUrl} failed: ${(error as Error).message}`);
    }
  }

  // PUTリクエスト🔄
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `PUT request to ${endpoint} failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, `PUT request to ${endpoint} failed: ${(error as Error).message}`);
    }
  }

  // DELETEリクエスト🗑️
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `DELETE request to ${endpoint} failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, `DELETE request to ${endpoint} failed: ${(error as Error).message}`);
    }
  }
}

export const apiClient = new ApiClient();
