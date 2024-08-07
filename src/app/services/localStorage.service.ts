import {Injectable} from '@angular/core';
import {User} from "../store/model/user.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storageKey = 'user';
  private userSubject = new BehaviorSubject<User | null>(this.getUser())

  setUser(user: User) {
    localStorage.setItem(this.storageKey, JSON.stringify(user))
    this.userSubject.next(user)
  }

  getUser(): User | null {
    const userString = localStorage.getItem(this.storageKey)
    if (userString) {
      try {
        return JSON.parse(userString)
      } catch (error) {
        console.error('Failed to parse user from localStorage', error)
        return null
      }
    }
    return null
  }

  getUserObservable() {
    return this.userSubject.asObservable()
  }

  storageClear() {
    localStorage.clear()
    this.userSubject.next(null)
  }
}
