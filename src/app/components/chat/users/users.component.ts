import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {combineLatest, Observable, startWith} from "rxjs";
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
export class UsersComponent implements OnInit {
  @Input({required: true}) selectedChatId: number | null = null
  @Output() selectChat = new EventEmitter<SelectedChatType>()
  users$: Observable<User[]>

  modalVariables: UserModalVariables = {
    visible: false,
    searchString: new FormControl(''),
    filteredData: []
  }

  private store = inject(Store);

  constructor() {
    this.users$ = this.store.select(state => state.users.value);
  }

  onSelectChat(id: number) {
    this.selectChat.emit({id: id, type: "chat"})
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsers());

    combineLatest([
      this.users$,
      this.modalVariables.searchString.valueChanges.pipe(startWith(''))
    ]).subscribe(([users, searchString]) => {
      this.modalVariables.filteredData = searchString
        ? users.filter(channel => channel.username.toLowerCase().includes(searchString.toLowerCase()))
        : users;
    });
  }
}
