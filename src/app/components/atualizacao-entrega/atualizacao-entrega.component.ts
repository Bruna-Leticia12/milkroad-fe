import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';
import { EntregaDTO } from '../../models/entrega.model';


@Component({
  selector: 'app-atualizacao-entrega',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './atualizacao-entrega.component.html',
  styleUrls: ['./atualizacao-entrega.component.scss']
})
export class AtualizacaoEntregaComponent implements OnInit {
  nomeCliente: string = '';
  entregas: EntregaDTO[] = [];
  entregaSelecionada?: EntregaDTO;
  dataSelecionada: Date = new Date();
  escolha: 'RECEBER' | 'CANCELAR' = 'RECEBER';
  mensagem: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // Aqui você deve recuperar o nome do cliente logado (via token/jwt ou serviço de autenticação)
    this.nomeCliente = localStorage.getItem('nomeCliente') || 'Cliente';

    // Busca entregas do cliente logado
    this.api.get<EntregaDTO[]>("/entregas/cliente/${localStorage.getItem('clienteId')}") .subscribe({
      next: (data) => this.entregas = data,
      error: (err) => console.error('Erro ao buscar entregas', err)
    });
  }

  onDataChange(event: any) {
    const dataISO = new Date(event).toISOString().substring(0,10); 
    this.entregaSelecionada = this.entregas.find(e => e.dataEntrega === dataISO); 
    this.escolha = this.entregaSelecionada?.confirmada ? 'RECEBER' : 'CANCELAR'; 
  } 
  escolher(opcao: 'RECEBER' | 'CANCELAR') { 
      this.escolha = opcao; 

    }

  confirmar() {
    if (!this.entregaSelecionada) {
      this.mensagem = 'Selecione uma data válida.';
      return;
    }

    if (this.escolha === 'CANCELAR') {
      this.api.put<EntregaDTO>
      (`/entregas/${this.entregaSelecionada.idEntrega}/cancelar`, {})
      .subscribe({
        next: (resp) => {
          this.mensagem = 'Entrega cancelada com sucesso!';
          this.entregaSelecionada = resp;
        },
        error: (err) => {
          this.mensagem = 'Erro: ' + (err.error || 'Não foi possível cancelar.'); 
        } 
      }); 
    } else { 
      this.mensagem = 'Entrega confirmada (já ativa por padrão).';
    }
  }
}
