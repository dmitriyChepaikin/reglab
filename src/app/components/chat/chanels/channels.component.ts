import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {combineLatest, Observable, startWith} from "rxjs";
import {Store} from "@ngrx/store";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {DialogModule} from "primeng/dialog";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {AsyncPipe} from "@angular/common";
import {Channel} from "../../../store/model/channel.model";
import {loadChannels} from "../../../store/actions/channels.actions";
import {SelectedChatType} from "../chat.component";

interface UserModalVariables {
  visible: boolean
  searchString: FormControl<string | null>
  filteredData: Channel[]
}

@Component({
  selector: 'app-chat-channels',
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
  templateUrl: './channels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelsComponent implements OnInit {
  @Input({required: true}) selectedChatId: number | null = null
  @Output() selectChat = new EventEmitter<SelectedChatType>()
  channels$: Observable<Channel[]>

  modalVariables: UserModalVariables = {
    visible: false,
    searchString: new FormControl(''),
    filteredData: []
  }

  private store = inject(Store);

  constructor(){
    this.channels$ = this.store.select(state => state.channels.value);

  }

  onSelectChat(id: number) {
    this.selectChat.emit({id: id, type: "channel"})
  }

  ngOnInit(): void {
    this.store.dispatch(loadChannels());

    this.channels$.subscribe((ss) => {
      console.log(ss)
    })

    combineLatest([
      this.channels$,
      this.modalVariables.searchString.valueChanges.pipe(startWith(''))
    ]).subscribe(([channels, searchString]) => {
      this.modalVariables.filteredData = searchString
        ? channels.filter(channel => channel.name.toLowerCase().includes(searchString.toLowerCase()))
        : channels;
    });
  }
}
