import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { CadastroClienteComponent } from './components/cadastro-cliente/cadastro-cliente.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },

  // ✅ Somente ADMIN pode cadastrar clientes
  { path: 'cadastro-cliente', component: CadastroClienteComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },

  // ✅ Demais rotas autenticadas
  {
    path: 'lista-clientes',
    loadComponent: () => import('./components/lista-clientes/lista-clientes.component').then(m => m.ListaClientesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'entregas',
    loadComponent: () => import('./components/entrega/entrega.component').then(m => m.EntregaComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'atualizacao-entrega',
    loadComponent: () => import('./components/atualizacao-entrega/atualizacao-entrega.component').then(m => m.AtualizacaoEntregaComponent),
    canActivate: [AuthGuard],
  },

  // ✅ Apenas ADMIN pode acessar “Atualização de Rotas”
  {
    path: 'atualizacao-rota',
    loadComponent: () => import('./components/atualizacao-rota/atualizacao-rota.component').then(m => m.AtualizacaoRotaComponent),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
