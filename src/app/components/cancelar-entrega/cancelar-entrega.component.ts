import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { ApiService } from '../../services/api.service';
import { EntregaDTO } from '../../models/entrega.model';

registerLocaleData(localePt);

interface ClienteResponseDTO {
  id: number;
  nome: string;
  celular: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  ativo: boolean;
  perfil: 'ADMIN' | 'CLIENTE';
}

@Component({
  selector: 'app-cancelar-entrega',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './cancelar-entrega.component.html',
  styleUrls: ['./cancelar-entrega.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class CancelarListaClienteComponent implements OnInit {
  nomeCliente: string = '';
  entregas: EntregaDTO[] = [];
  entregaSelecionada?: EntregaDTO;
  dataSelecionada: Date = new Date();
  escolha: 'RECEBER' | 'CANCELAR' = 'RECEBER';
  mensagem: string = '';

  isAdmin = false;
  perfil: string | null = null;
  clientes: ClienteResponseDTO[] = [];
  filtroCliente = '';
  clienteSelecionadoId?: number;
  mostrarLista = false;

  constructor(
    private api: ApiService,
    private adapter: DateAdapter<Date>,
    private router: Router
  ) {
    this.adapter.setLocale('pt-BR');
    this.adapter.getFirstDayOfWeek = () => 1;
  }

  ngOnInit(): void {
    this.perfil = localStorage.getItem('perfil');
    this.isAdmin = this.perfil === 'ADMIN';

    if (this.isAdmin) {
      this.carregarClientes();
    } else {
      const localNome = localStorage.getItem('nomeCliente') || localStorage.getItem('nome') || 'Cliente';
      this.nomeCliente = localNome;
      const clienteId = localStorage.getItem('clienteId') || localStorage.getItem('id');
      if (clienteId) {
        this.clienteSelecionadoId = Number(clienteId);
        this.buscarEntregasPorClienteId(Number(clienteId));
      }
    }
  }

  voltarMenu() {
    const perfil = localStorage.getItem('perfil');
    if (perfil === 'ADMIN') {
      this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  voltar() {
    this.voltarMenu();
  }

  carregarClientes() {
    this.api.get<ClienteResponseDTO[]>('/clientes').subscribe({
      next: (data) => {
        this.clientes = (data || []).filter(c => c.perfil === 'CLIENTE');
      },
      error: (err) => {
        console.error('Erro ao listar clientes', err);
        this.clientes = [];
      }
    });
  }

  get clientesFiltrados(): ClienteResponseDTO[] {
    const f = this.filtroCliente?.toLowerCase()?.trim() || '';
    if (f.length < 2) {
      this.mostrarLista = false;
      return [];
    }
    const filtrados = this.clientes.filter(c => c.nome.toLowerCase().includes(f));
    this.mostrarLista = filtrados.length > 0;
    return filtrados;
  }

  selecionarCliente(cliente: ClienteResponseDTO) {
    this.clienteSelecionadoId = cliente.id;
    this.nomeCliente = cliente.nome;
    this.filtroCliente = cliente.nome;
    this.mostrarLista = false;
    this.resetarTela(false);
    this.buscarEntregasPorClienteId(cliente.id);
  }

  limparBusca() {
    this.filtroCliente = '';
    this.mostrarLista = false;
    this.clienteSelecionadoId = undefined;
    this.nomeCliente = '';
    this.entregas = [];
    this.entregaSelecionada = undefined;
    this.mensagem = '';
  }

  private buscarEntregasPorClienteId(clienteId: number) {
    this.api.get<EntregaDTO[]>(`/entregas/cliente/${clienteId}`).subscribe({
      next: (data) => this.entregas = data || [],
      error: (err) => {
        console.error('Erro ao buscar entregas', err);
        this.entregas = [];
      }
    });
  }

  onDataChange(event: any) {
    const data = event instanceof Date ? event : new Date(event);
    const dataISO = data.toISOString().substring(0, 10);
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
      this.api.put<EntregaDTO>(`/entregas/${this.entregaSelecionada.idEntrega}/cancelar`, {})
        .subscribe({
          next: () => {
            this.mensagem = 'Entrega cancelada com sucesso!';
            this.atualizarLista();
          },
          error: (err) => {
            console.error('Erro ao cancelar entrega', err);
            const texto = err?.error?.message || err?.error || 'Não foi possível cancelar.';
            this.mensagem = texto;
          }
        });
    } else {
      this.mensagem = 'Entrega confirmada com sucesso!';
      this.atualizarLista();
    }
  }

  private atualizarLista() {
    const clienteId = Number(localStorage.getItem('clienteId') || this.clienteSelecionadoId);
    if (clienteId) {
      this.buscarEntregasPorClienteId(clienteId);
    }
    this.resetarTela();
  }

  private resetarTela(resetCliente: boolean = true) {
    setTimeout(() => {
      this.mensagem = '';
      this.entregaSelecionada = undefined;
      this.dataSelecionada = new Date();
      this.escolha = 'RECEBER';
      if (this.isAdmin && resetCliente) {
        this.filtroCliente = '';
        this.nomeCliente = '';
        this.clienteSelecionadoId = undefined;
      }
    }, 2000);
  }
}