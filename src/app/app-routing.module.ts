import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

// rotas principais (adicione outras rotas quando criar novos componentes)
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'dashboard', component: DashboardComponent }, // exemplo futuro
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
