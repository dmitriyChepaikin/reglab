import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, Observable, switchMap} from 'rxjs';
import {User} from "../store/model/user.model";
import {Message} from "../store/model/message.model";
import {Channel} from "../store/model/channel.model";
import {map, mergeMap} from "rxjs/operators";
import {LocalStorageService} from "./localStorage.service";
import {UserChannel} from "../store/model/user-channel.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  currentUserId: number | null = null

  constructor(private http: HttpClient, private localStorageService:LocalStorageService) {
    this.currentUserId = this.localStorageService.getUser()?.id || null
  }

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`);
  }

  getChannel(id: number): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`, {params: {id: id}});
  }

  // getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(`${this.apiUrl}/users`);
  // }
  getUser(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {params: {id: id}});
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`);
  }


  // 1. Получение списка users с которыми есть связь у текущего пользователя
  getUsersWithCurrentUser(): Observable<User[]> {
    return this.http.get<UserChannel[]>(`${this.apiUrl}/userChannels?user_id=${this.currentUserId}`)
      .pipe(
        switchMap(userChannels => {
          const channelIds = userChannels.map(uc => uc.channel_id);
          return forkJoin(channelIds.map(channelId =>
            this.http.get<UserChannel[]>(`${this.apiUrl}/userChannels?channel_id=${channelId}`)
          )).pipe(
            map(userChannelsArray => userChannelsArray.flat()),
            map(userChannels => userChannels.filter(uc => uc.user_id !== this.currentUserId)),
            map(userChannels => [...new Set(userChannels.map(uc => uc.user_id))]),
            switchMap(userIds => {
              const userRequests = userIds.map(userId =>
                this.http.get<User>(`${this.apiUrl}/users/?id=${userId}`)
              );
              return forkJoin(userRequests).pipe(
                map(users => users.flat())
              );
            })
          );
        })
      );
  }


  // 2. Получение списка channels с которыми есть связь у текущего пользователя
  getChannelsWithCurrentUser(): Observable<Observable<any[]>> {
    return this.http.get<any[]>(`${this.apiUrl}/userChannels?user_id=${this.currentUserId}`)
      .pipe(
        map(userChannels => userChannels.map(uc => uc.channel_id)),
        map(channelIds => this.http.get<any[]>(`${this.apiUrl}/channels?id=${channelIds.join('&id=')}`))
      );
  }

  // 3. Добавление нового user в список users
  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  // 4. Добавление нового channel в список channels
  addChannel(channel: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/channels`, channel);
  }

  // 5. Получение списка сообщений с конкретным user
  getMessagesWithUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages?from_user=${userId}`);
  }

  // 6. Получение списка сообщений с конкретным channel
  getMessagesWithChannel(channelId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages?channel_id=${channelId}`);
  }

  // 7. Отправка нового сообщения с конкретным user
  sendMessageToUser(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages`, message);
  }

  // 8. Отправка нового сообщения с конкретным channel
  sendMessageToChannel(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages`, message);
  }

  // 9. Получение списка users с которыми нет связи у текущего пользователя
  getUsersWithoutCurrentUser(): Observable<Observable<any[]>> {
    return this.http.get<any[]>(`${this.apiUrl}/userChannels?user_id=${this.currentUserId}`)
      .pipe(
        map(userChannels => userChannels.map(uc => uc.user_id)),
        map(userIds => this.http.get<any[]>(`${this.apiUrl}/users?id_ne=${userIds.join('&id_ne=')}`))
      );
  }

  // 10. Получение списка channels с которыми нет связи у текущего пользователя
  getChannelsWithoutCurrentUser(): Observable<Observable<any[]>> {
    return this.http.get<any[]>(`${this.apiUrl}/userChannels?user_id=${this.currentUserId}`)
      .pipe(
        map(userChannels => userChannels.map(uc => uc.channel_id)),
        map(channelIds => this.http.get<any[]>(`${this.apiUrl}/channels?id_ne=${channelIds.join('&id_ne=')}`))
      );
  }
}
