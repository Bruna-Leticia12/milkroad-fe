import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lista-cliente',
  standalone: true,
  templateUrl: './lista-cliente.component.html',
  styleUrls: ['./lista-cliente.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class ListaClienteComponent implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  filtroStatus: string = 'ATIVOS';
  termoBusca: string = '';
  clienteSelecionado: any = null;
  formEdicao!: FormGroup;
  loading = true;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregarClientes();
    this.inicializarForm();
  }

  inicializarForm() {
    this.formEdicao = this.fb.group({
      nome: [''],
      telefone: [''],
      logradouro: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      cep: [''],
      ativo: [true]
    });
  }

  voltar() {
    this.router.navigate(['/menu']);
  }

  carregarClientes() {
    this.loading = true;
    this.api.get<any[]>('/clientes').subscribe({
      next: data => {
        this.clientes = data.filter(c => c.role !== 'admin' && c.nome.toLowerCase() !== 'admin');
        this.aplicarFiltro();
        this.loading = false;
      },
      error: err => {
        console.error('Erro ao buscar clientes:', err);
        this.loading = false;
      }
    });
  }

  aplicarFiltro() {
    let filtrados = this.clientes;

    if (this.filtroStatus === 'ATIVOS') {
      filtrados = this.clientes.filter(c => c.ativo);
    } else if (this.filtroStatus === 'INATIVOS') {
      filtrados = this.clientes.filter(c => !c.ativo);
    }

    if (this.termoBusca.trim() !== '') {
      filtrados = filtrados.filter(c =>
        c.nome.toLowerCase().includes(this.termoBusca.toLowerCase())
      );
    }

    this.clientesFiltrados = filtrados;
  }

  alternarStatus(cliente: any) {
    const novoStatus = !cliente.ativo;
    this.api.patch(`/clientes/${cliente.id}`, { ativo: novoStatus }).subscribe({
      next: () => {
        cliente.ativo = novoStatus;
        this.aplicarFiltro();
      },
      error: err => console.error('Erro ao atualizar status:', err)
    });
  }

  buscarPorNome() {
    this.aplicarFiltro();
  }

  selecionarCliente(cliente: any) {
    this.clienteSelecionado = { ...cliente };
    this.formEdicao.patchValue(this.clienteSelecionado);
  }

  salvarAlteracoes() {
    if (!this.clienteSelecionado) return;

    const dadosAtualizados = {
      ...this.clienteSelecionado,
      ...this.formEdicao.value,
      ativo: this.formEdicao.value.ativo === true
    };

    this.api.put(`/clientes/${this.clienteSelecionado.id}`, dadosAtualizados).subscribe({
      next: () => {
        this.snackBar.open('Cliente atualizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.resetarTela();
      },
      error: err => console.error('Erro ao atualizar cliente:', err)
    });
  }

  resetarTela() {
    this.formEdicao.reset({ ativo: true });
    this.clienteSelecionado = null;
    this.termoBusca = '';
    this.filtroStatus = 'ATIVOS';
    this.carregarClientes();
  }

  getStatusClass(ativo: boolean): string {
    return ativo ? 'status-ativo' : 'status-inativo';
  }

  getStatusText(ativo: boolean): string {
    return ativo ? 'Ativo' : 'Inativo';
  }
}