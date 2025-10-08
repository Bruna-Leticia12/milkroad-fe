import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { ApiService } from '../../services/api.service';
import { EntregaDTO } from '../../models/entrega.model';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// registra o locale pt-BR para datas e formatações
registerLocaleData(localePt);

@Component({
  selector: 'app-atualizacao-entrega',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './atualizacao-entrega.component.html',
  styleUrls: ['./atualizacao-entrega.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class AtualizacaoEntregaComponent implements OnInit {
  nomeCliente: string = '';
  entregas: EntregaDTO[] = [];
  entregaSelecionada?: EntregaDTO;
  dataSelecionada: Date = new Date();
  escolha: 'RECEBER' | 'CANCELAR' = 'RECEBER';
  mensagem: string = '';

  constructor(
    private api: ApiService,
    private adapter: DateAdapter<any>
  ) {
    // garante que o calendário use o formato brasileiro
    this.adapter.setLocale('pt-BR');
  }

  ngOnInit(): void {
    this.nomeCliente = localStorage.getItem('nomeCliente') || 'Cliente';

    // usa template string corretamente
    const clienteId = localStorage.getItem('clienteId');
    if (clienteId) {
      this.api.get<EntregaDTO[]>(`/entregas/cliente/${clienteId}`).subscribe({
        next: (data) => (this.entregas = data),
        error: (err) => console.error('Erro ao buscar entregas', err)
      });
    }
  }

  onDataChange(event: any) {
    const dataISO = new Date(event).toISOString().substring(0, 10);
    this.entregaSelecionada = this.entregas.find(e => e.dataEntrega === dataISO);

    // atualiza a escolha automaticamente
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
      this.api.put<EntregaDTO>(
        `/entregas/${this.entregaSelecionada.idEntrega}/cancelar`,
        {}
      ).subscribe({
        next: (resp) => {
          this.mensagem = 'Entrega cancelada com sucesso!';
          this.entregaSelecionada = resp;
        },
        error: (err) => {
          this.mensagem = 'Erro: ' + (err.error?.message || 'Não foi possível cancelar.');
        }
      });
    } else {
      this.mensagem = 'Entrega confirmada (já ativa por padrão).';
    }
  }
}
