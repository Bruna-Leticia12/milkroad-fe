import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.scss'],
  standalone: false
})
export class CadastroClienteComponent {
  form: FormGroup;
  loading = false;
  perfil: string | null = null;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      celular: ['', Validators.required],
      telefone: [''],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      cep: ['', Validators.required],
      email: ['', Validators.required],
    });

    this.perfil = localStorage.getItem('perfil');
  }

  submit() {
    if (this.form.invalid) {
      this.snack.open('Preencha os campos obrigatórios', 'OK', { duration: 2500 });
      return;
    }

    this.loading = true;
    const cliente = { ...this.form.value, perfil: 'CLIENTE' };

    this.api.post('/clientes', cliente).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Cliente cadastrado com sucesso!', 'OK', { duration: 2500 });
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.snack.open('Erro ao cadastrar cliente', 'OK', { duration: 2500 });
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

  voltar() {
    this.voltarMenu();
  }
}