import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service'; // se tiver esta service
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

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private api: ApiService // se não tiver, remova/ajuste
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
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.snack.open('Preencha os campos obrigatórios', 'OK', { duration: 2500 });
      return;
    }

    this.loading = true;

    // Se você tem ApiService e endpoint POST /api/clientes, use-o:
    // this.api.post('/api/clientes', this.form.value).subscribe( ... )

    // Por ora vamos simular:
    setTimeout(() => {
      this.loading = false;
      this.snack.open('Cliente cadastrado com sucesso!', 'OK', { duration: 2500 });
      // opcional: voltar ao menu
      this.router.navigate(['/menu']);
    }, 900);
  }
}
