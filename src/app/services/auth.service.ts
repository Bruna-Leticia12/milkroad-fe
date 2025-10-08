import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) {}

  // Envia request ao backend: POST http://localhost:8080/api/auth/login
  login(body: LoginRequest): Observable<LoginResponse> {
    // auth = false -> não envia token (login)
    return this.api.post<LoginResponse>('/auth/login', body, false).pipe(
      tap(resp => {
        if (resp && resp.token) {
          localStorage.setItem('token', resp.token);
          // converte id para string de forma segura
          if (resp.id !== undefined && resp.id !== null) {
            localStorage.setItem('id', String(resp.id));
          } else {
            localStorage.removeItem('id');
          }
          if (resp.nome) {
            localStorage.setItem('nome', resp.nome);
          } else {
            localStorage.removeItem('nome');
          }
          if (resp.perfil) {
            localStorage.setItem('perfil', resp.perfil);
          } else {
            localStorage.removeItem('perfil');
          }
          if (resp.email) {
            localStorage.setItem('email', resp.email);
          } else {
            localStorage.removeItem('email');
          }
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('nome');
    localStorage.removeItem('perfil');
    localStorage.removeItem('email');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
