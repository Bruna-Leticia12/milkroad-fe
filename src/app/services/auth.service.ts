import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getUser() {
    throw new Error('Method not implemented.');
  }
  constructor(private api: ApiService) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', body, false).pipe(
      tap(resp => {
        if (resp && resp.token) {
          localStorage.setItem('token', resp.token);

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
        } else {
          console.error('⚠️ Resposta de login inválida:', resp);
        }
      }),
      catchError(err => {
        console.error('❌ Erro ao fazer login:', err);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('nome');
    localStorage.removeItem('perfil');
    localStorage.removeItem('email');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token.trim() !== '';
  }

  getUserRole(): string | null {
    return localStorage.getItem('perfil');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}