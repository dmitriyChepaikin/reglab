import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "../store/model/user.model";
import {Message} from "../store/model/message.model";
import {Channel} from "../store/model/channel.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`);
  }

  getChannel(id: number): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`, {params: {id: id}});
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  getUser(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {params: {id: id}});
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`);
  }
}
