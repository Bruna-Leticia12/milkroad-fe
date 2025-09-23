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
      next: () => {
        this.loading = false;
        this.snack.open('Login efetuado!', 'OK', { duration: 2000 });
        // redirecionar para dashboard (a implementar)
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.snack.open('Credenciais inválidas', 'OK', { duration: 3000 });
      }
    });
  }
}
