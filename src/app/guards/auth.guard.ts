import {CanActivateFn, Router} from '@angular/router'
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService)
  const router: Router = inject(Router)


  if (authService.isAuthenticated()) {
    return true
  } else {
    localStorage.clear()
    router.navigate(['/login']);
    return false
  }
}
