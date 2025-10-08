import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(auth: boolean = true) {
    if (!auth) { 
      return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }; 
    }

  const token = localStorage.getItem('token'); 
  if (token) { 
    return { 
      headers: new HttpHeaders({ 
          'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }) 
    }; 
  } 
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }; 
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
}
