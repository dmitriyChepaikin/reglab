import {Routes} from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: 'login',
    title: 'Авторизация',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    title: 'Главная',
    loadComponent: () =>
      import('./pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    title: 'Настройки пользователя',
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
