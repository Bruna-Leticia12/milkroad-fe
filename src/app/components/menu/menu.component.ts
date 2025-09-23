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

  navigate(path: string) {
    console.log(`Clicou em ${path}`);
    // 🔹 futuramente pode usar this.router.navigate([path]);
  }
}
