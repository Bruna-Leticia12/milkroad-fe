// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(auth: boolean = true) {
    const headersConfig: any = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');

    if (auth && token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    return { headers: new HttpHeaders(headersConfig) };
  }

  post<T>(path: string, body: any, auth: boolean = true) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, this.getAuthHeaders(auth));
  }

  get<T>(path: string, auth: boolean = true) {
    return this.http.get<T>(`${this.baseUrl}${path}`, this.getAuthHeaders(auth));
  }

  put<T>(path: string, body: any, auth: boolean = true) {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, this.getAuthHeaders(auth));
  }

  patch<T>(path: string, body: any, auth: boolean = true) {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, this.getAuthHeaders(auth));
  }
}
