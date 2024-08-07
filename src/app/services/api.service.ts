import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, switchMap} from 'rxjs';
import {User} from "../store/model/user.model";
import {Message, UserMessage} from "../store/model/message.model";
import {Channel} from "../store/model/channel.model";
import {map} from "rxjs/operators";
import {LocalStorageService} from "./localStorage.service";
import {UserChannel} from "../store/model/user-channel.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  currentUserId: number | null = null

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    this.localStorageService.getUserObservable().subscribe(user => {
      this.currentUserId = user?.id || null;
    });
  }

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

  /** Получение списка users с которыми есть связь у текущего пользователя*/
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

  /** Получение списка users с которыми нет связи у текущего пользователя */
  getUsersWithoutCurrentUser(): Observable<User[]> {
    return forkJoin({
      allUsers: this.http.get<User[]>(`${this.apiUrl}/users`),
      connectedUsers: this.getUsersWithCurrentUser()
    }).pipe(
      map(results => {
        const connectedUserIds = results.connectedUsers.map(user => user.id);
        return results.allUsers.filter(user => !connectedUserIds.includes(user.id) && user.id != this.currentUserId);
      })
    );
  }

  /** Создание  связи между пользователями */
  connectUser(userId: number): Observable<UserChannel[]> {
    const uniqueId = Date.now();

    const connectedUserDataChannel = {
      user_id: userId,
      channel_id: uniqueId
    };

    const currentUserDataChannel = {
      user_id: this.currentUserId,
      channel_id: uniqueId
    };

    const request1 = this.http.post<UserChannel>(`${this.apiUrl}/userChannels`, connectedUserDataChannel);
    const request2 = this.http.post<UserChannel>(`${this.apiUrl}/userChannels`, currentUserDataChannel);

    return forkJoin([request1, request2]).pipe(
      map(responses => responses)
    );
  }

  /** Получение списка сообщений с конкретным user */
  getMessagesWithUser(userId: number): Observable<{ messages: Message[], channelId: number | null }> {
    return forkJoin({
      currentUserChannels: this.http.get<UserChannel[]>(`${this.apiUrl}/userChannels?user_id=${this.currentUserId}`),
      targetUserChannels: this.http.get<UserChannel[]>(`${this.apiUrl}/userChannels?user_id=${userId}`)
    }).pipe(
      map(results => {
        const commonChannel = results.currentUserChannels.find(cu => results.targetUserChannels.some(tu => tu.channel_id === cu.channel_id));
        return commonChannel ? commonChannel.channel_id : null;
      }),
      switchMap(channelId => {
        if (channelId) {
          return this.http.get<Message[]>(`${this.apiUrl}/messages?channel_id=${channelId}`).pipe(
            map(messages => ({messages, channelId}))
          );
        } else {
          return [{messages: [], channelId: null}];
        }
      })
    );
  }

  /** Получение списка каналов, связанных с текущим пользователем */
  getChannelsWithCurrentUser(): Observable<Channel[]> {
    return this.http.get<UserChannel[]>(`${this.apiUrl}/userChannels?user_id=${this.currentUserId}`).pipe(
      switchMap(userChannels => {
        const channelIds = userChannels.map(uc => uc.channel_id);
        const channelRequests = channelIds.map(channelId => {
          return this.http.get<Channel>(`${this.apiUrl}/channels?id=${channelId}`);
        });
        return forkJoin(channelRequests).pipe(
          map(channels => channels.flat())
        );
      })
    );
  }

  /** Получение списка каналов, не связанных с текущим пользователем */
  getChannelsWithoutCurrentUser(): Observable<Channel[]> {
    return forkJoin({
      allChannels: this.http.get<Channel[]>(`${this.apiUrl}/channels`),
      connectedChannels: this.getChannelsWithCurrentUser()
    }).pipe(
      map(results => {
        const connectedChannelIds = results.connectedChannels.map(channel => channel.id);
        return results.allChannels.filter(channel => !connectedChannelIds.includes(channel.id));
      })
    );
  }

  /** Создание  связи между пользователeм и каналом */
  connectUserToChannel(channelId: number): Observable<UserChannel> {
    const currentUserDataChannel = {
      user_id: this.currentUserId,
      channel_id: channelId
    };

    return this.http.post<UserChannel>(`${this.apiUrl}/userChannels`, currentUserDataChannel);
  }

  /** Получение списка сообщений канала */
  getChannelMessages(channelId: number): Observable<{ messages: UserMessage[], channelId: number }> {
    return this.http.get<UserMessage[]>(`${this.apiUrl}/messages?channel_id=${channelId}`).pipe(
      switchMap(messages => {
        return this.getUsers().pipe(
          map((users: User[]) => {
            const messagesWithUserInfo = messages.map(message => ({
              ...message,
              username: users?.find((user) => user?.id == message.from_user)?.username ?? ''
            }));
            return {messages: messagesWithUserInfo, channelId: channelId};
          })
        );
      })
    )
  }

  /** Отправка сообщения */
  sendMessageToChannel(message: Message) {
    return this.http.post(`${this.apiUrl}/messages`, message);
  }
}
