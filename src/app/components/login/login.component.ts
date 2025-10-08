import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }
  teste(){
    console.log("Voce clicou")
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

  this.auth.login(this.form.value).subscribe({ 
    next: (usuario) => { 
      this.loading = false; 
      this.snack.open('Login efetuado!', 'OK', { duration: 2000 });

        // Redireciona conforme perfil
      if (usuario.perfil === 'CLIENTE') { 
        localStorage.setItem('clienteId', usuario.id.toString()); 
        localStorage.setItem('nomeCliente', usuario.nome); 
        this.router.navigateByUrl('/atualizacao-entrega'); 
      } else { 
        this.router.navigateByUrl('/menu'); // admin
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro no login:', err);
        this.snack.open('Credenciais inválidas', 'OK', { duration: 3000 });
      }
    });
  }
}
