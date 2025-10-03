import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { EntregaDTO } from '../../models/entrega.model';

@Component({
  selector: 'app-entrega',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.scss']
})
export class EntregaComponent implements OnInit {
  entregas: EntregaDTO[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
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

  getStatusText(confirmada: boolean): string {
    return confirmada ? 'OK' : 'NÃO';
  }

  getStatusClass(confirmada: boolean): string {
    return confirmada ? 'status-ok' : 'status-nao';
  }
}
