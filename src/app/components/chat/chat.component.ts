import {Component, inject, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {Message} from "../../store/model/message.model";
import {loadMessages} from "../../store/actions/message.actions";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Button} from "primeng/button";
import {LocalStorageService} from "../../services/localStorage.service";
import {User} from "../../store/model/user.model";
import {AvatarModule} from "primeng/avatar";
import {ApiService} from "../../services/api.service";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AuthService} from "../../services/auth.service";
import {DialogModule} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {ChipsModule} from "primeng/chips";
import {UsersComponent} from "./users/users.component";
import {ChannelsComponent} from "./chanels/channels.component";
import {Channel} from "../../store/model/channel.model";

export type ChatType = 'chat' | 'channel'
export type SelectedChatType = { id: number, type: ChatType }

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    AsyncPipe,
    Button,
    AvatarModule,
    NgIf,
    NgForOf,
    OverlayPanelModule,
    DialogModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    ChipsModule,
    UsersComponent,
    ChannelsComponent
  ],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  messages$: Observable<Message[]>


  messages: Message[] = []

  user: User | null = null

  selectedChatId: number | null = null

  selectedUserOrChannel: User | Channel | null = null

  private store = inject(Store);

  constructor(
    private localStorageService: LocalStorageService,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.user = this.localStorageService.getUser()
    this.messages$ = this.store.select(state => state.messages.messages);
  }

  isChannelType(chat: User | Channel | null ): chat is Channel {
  return chat !== null && 'name' in chat;
}

  onSelectChat(item: SelectedChatType) {
    this.selectedChatId = item.id

    item.type === 'chat'
    ? this.onSelectUser(item.id)
    : this.onSelectChannel(item.id)

  }

  onSelectUser(id: number) {
    this.apiService.getUser(id).subscribe({
      next: (user) => {
        this.selectedUserOrChannel = user[0]
        console.log(this.selectedUserOrChannel)
      }
    })
  }
  onSelectChannel(id: number) {
    this.apiService.getChannel(id).subscribe({
      next: (channel) => {
        this.selectedUserOrChannel = channel[0]
        console.log(this.selectedUserOrChannel)
      }
    })
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnInit(): void {
    this.messages$.subscribe({
      next: (messages) => {
        this.messages = messages || []
      }
    })

    this.store.dispatch(loadMessages());
  }
}
