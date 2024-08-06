import {Injectable} from '@angular/core';
import {User} from "../store/model/user.model";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storageKey = 'user';

  setUser(user: User) {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const userString = localStorage.getItem(this.storageKey);
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        return null;
      }
    }
    return null;
  }

  storageClear() {
    localStorage.clear();
  }
}
