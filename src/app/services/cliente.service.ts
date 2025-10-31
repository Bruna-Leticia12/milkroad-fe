import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  constructor(private api: ApiService) {}

  listarTodos(): Observable<any[]> {
    return this.api.get<any[]>('/clientes');
  }

  listarAtivos(): Observable<any[]> {
    return this.api.get<any[]>('/clientes/ativos');
  }

  listarInativos(): Observable<any[]> {
    return this.api.get<any[]>('/clientes/inativos');
  }

  buscarPorNome(nome: string): Observable<any> {
    return this.api.get<any>(`/clientes/nome/${nome}`);
  }

  atualizarCliente(id: number, dados: any): Observable<any> {
    return this.api.put<any>(`/clientes/${id}`, dados);
  }

  desativarCliente(id: number): Observable<void> {
    return this.api.put<void>(`/clientes/${id}/desativar`, {});
  }

  ativarCliente(id: number): Observable<any> {
    return this.api.put<any>(`/clientes/${id}`, { ativo: true });
  }
}
