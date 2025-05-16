/* eslint-disable @typescript-eslint/no-explicit-any */

// クラス版のAPIクライアント🔥
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class ApiRoutesClient {
  private getApiRoutesUrl(endpoint: string): string {
    return `/api${endpoint}`;
  }

  // 共通エラーハンドリング
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || `Request failed with status ${response.status}`,
        response.status,
      );
    }

    return data.data;
  }

  // GETリクエスト🔍
  async get<T>(endpoint: string): Promise<T> {
    try {
      const apiUrl = this.getApiRoutesUrl(endpoint);
      const response = await fetch(apiUrl);

      return this.handleResponse<T>(response);
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
      );
    }
  }

  // POSTリクエスト📝
  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    try {
      const apiUrl = this.getApiRoutesUrl(endpoint);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
      );
    }
  }

  // PUTリクエスト🔄
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const apiUrl = this.getApiRoutesUrl(endpoint);
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return this.handleResponse<T>(response);
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
      );
    }
  }

  // PATCHリクエスト🩹
  async patch<T>(endpoint: string, data: any): Promise<T> {
    try {
      const apiUrl = this.getApiRoutesUrl(endpoint);
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return this.handleResponse<T>(response);
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
      );
    }
  }

  // DELETEリクエスト🗑️
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const apiUrl = this.getApiRoutesUrl(endpoint);
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<T>(response);
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
      );
    }
  }
}

// シングルトンインスタンス
export const apiClient = new ApiRoutesClient();
