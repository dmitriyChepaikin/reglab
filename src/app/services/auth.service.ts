import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {LocalStorageService} from "./localStorage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private messageService: MessageService
  ) {
    this.loggedIn = !!this.localStorageService.getUser()
  }

  login(username: string, password: string) {
    this.loggedIn = (username === 'test' && password === 'test123');
    if (this.loggedIn) {
      this.localStorageService.setUser({
        id: 1,
        username: 'test',
        is_online: true
      })
      this.router.navigate(['/']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Authorization error',
        detail: 'Invalid username or password',
      })
    }
  }

  logout(): void {
    this.localStorageService.storageClear()
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}
