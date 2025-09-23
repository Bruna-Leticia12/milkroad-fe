// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      };
    }
    return { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
  }

  post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, this.getAuthHeaders());
  }

  get<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}${path}`, this.getAuthHeaders());
  }

  put<T>(path: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, this.getAuthHeaders());
  }
}
