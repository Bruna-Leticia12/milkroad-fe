import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { CadastroClienteComponent } from './components/cadastro-cliente/cadastro-cliente.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cadastro-cliente', component: CadastroClienteComponent },

  // Standalone components via loadComponent
  { 
    path: 'lista-clientes', 
    loadComponent: () => import('./components/lista-clientes/lista-clientes.component')
      .then(m => m.ListaClientesComponent) 
  },
  { 
    path: 'entregas', 
    loadComponent: () => import('./components/entrega/entrega.component')
      .then(m => m.EntregaComponent) 
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
