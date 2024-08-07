import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {combineLatest, Observable, startWith, Subject, takeUntil} from "rxjs";
import {Store} from "@ngrx/store";
import {User} from "../../../store/model/user.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {loadUsers} from "../../../store/actions/user.actions";
import {Button} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {DialogModule} from "primeng/dialog";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {AsyncPipe} from "@angular/common";
import {SelectedChatType} from "../chat.component";
import {ApiService} from "../../../services/api.service";

interface UserModalVariables {
  visible: boolean
  searchString: FormControl<string | null>
  filteredData: User[]
}

@Component({
  selector: 'app-chat-users',
  standalone: true,
  imports: [
    Button,
    AvatarModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
    InputTextModule,
    AsyncPipe
  ],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {
  @Input({required: true}) selectedChatId: number | null = null
  @Output() selectChat = new EventEmitter<SelectedChatType>()
  users$: Observable<User[]>

  modalVariables: UserModalVariables = {
    visible: false,
    searchString: new FormControl(''),
    filteredData: []
  }

  private store = inject(Store)
  private destroy$ = new Subject<void>()

  constructor(private apiService: ApiService) {
    this.users$ = this.store.select(state => state.users.value)
  }

  onSelectUser(userId: number) {
    this.apiService.connectUser(userId).subscribe({
      next: () => {
        this.store.dispatch(loadUsers())
        this.modalVariables = {
          visible: false,
          searchString: new FormControl(''),
          filteredData: this.modalVariables.filteredData.filter((item) => item.id !== userId)
        }
      }
    })
  }

  onSelectChat(id: number) {
    this.selectChat.emit({id: id, type: "chat"})
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsers())

    combineLatest([
      this.apiService.getUsersWithoutCurrentUser(),
      this.modalVariables.searchString.valueChanges.pipe(startWith(''))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([users, searchString]) => {
      this.modalVariables.filteredData = searchString
        ? users.filter(channel => channel.username.toLowerCase().includes(searchString.toLowerCase()))
        : users
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
