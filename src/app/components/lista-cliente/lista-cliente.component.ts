import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { EntregaDTO } from '../../models/entrega.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-cliente.component.html',
  styleUrls: ['./lista-cliente.component.scss']
})
export class ListaClienteComponent implements OnInit {
  entregas: EntregaDTO[] = [];
  loading = true;
  perfil: string | null = null; // ✅ declarada

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.perfil = localStorage.getItem('perfil');
    this.api.get<EntregaDTO[]>('/entregas/hoje').subscribe({
      next: (data) => {
        this.entregas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar entregas', err);
        this.loading = false;
      }
    });
  }

  voltarMenu() {
    const perfil = localStorage.getItem('perfil');
    if (perfil === 'ADMIN') {
      this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // ✅ Novo método para funcionar com o HTML atual
  voltar() {
    this.voltarMenu();
  }

  getStatusText(confirmada: boolean): string {
    return confirmada ? 'OK' : 'NÃO';
  }

  getStatusClass(confirmada: boolean): string {
    return confirmada ? 'status-ok' : 'status-nao';
  }
}
