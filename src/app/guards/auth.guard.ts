import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const isAuthenticated = this.authService.isAuthenticated();
    const perfil = this.authService.getUserRole();

    // 🔒 Se não estiver autenticado, vai para login
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    // ✅ Se a rota tiver restrição de perfil (ex: ADMIN)
    const allowedRoles = route.data['roles'] as string[] | undefined;
    if (allowedRoles && !allowedRoles.includes(perfil || '')) {
      // ❌ Se o perfil não estiver autorizado, volta ao menu
      this.router.navigate(['/menu']);
      return false;
    }

    // ✅ Tudo certo
    return true;
  }
}
