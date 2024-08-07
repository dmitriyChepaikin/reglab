import {Component, OnDestroy} from '@angular/core';
import {LocalStorageService} from "../../services/localStorage.service";
import {User} from "../../store/model/user.model";
import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {Channel} from "../../store/model/channel.model";
import {MessagesWindowComponent} from "./messages-window/messages-window.component";
import {UsersComponent} from "./users/users.component";
import {ChannelsComponent} from "./chanels/channels.component";
import {Button} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {Subject, takeUntil} from "rxjs";

export type ChatType = 'chat' | 'channel'
export type SelectedChatType = { id: number, type: ChatType }

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MessagesWindowComponent,
    UsersComponent,
    ChannelsComponent,
    Button,
    AvatarModule
  ],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnDestroy {
  currentUser: User | null = null;
  selectedChatId: number | null = null;
  selectedUserOrChannel: User | Channel | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private localStorageService: LocalStorageService,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.currentUser = this.localStorageService.getUser();
  }

  onSelectChat(item: SelectedChatType) {
    this.selectedChatId = item.id;

    if (item.type === 'chat') {
      this.onSelectUser(item.id);
    } else {
      this.onSelectChannel(item.id);
    }
  }

  onSelectUser(id: number) {
    this.apiService.getUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.selectedUserOrChannel = user[0];
        }
      });
  }

  onSelectChannel(id: number) {
    this.apiService.getChannel(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (channel) => {
          this.selectedUserOrChannel = channel[0];
        }
      });
  }

  until() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogout() {
    this.authService.logout();
    this.until()
  }

  ngOnDestroy() {
    this.until()
  }
}
