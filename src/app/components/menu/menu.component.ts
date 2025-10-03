import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent {
  constructor(private router: Router) {}

  // opcional — navegação programática se precisar no futuro
  navigate(path: string) {
    const url = `/${path}`;
    console.log('Tentando navegar para', url);
    this.router.navigateByUrl(url).then(ok => {
      console.log('Navegação ok?', ok);
    }).catch(err => {
      console.error('Erro na navegação:', err);
    });
  }
}
