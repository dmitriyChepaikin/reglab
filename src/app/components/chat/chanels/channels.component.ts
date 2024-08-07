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
import {ApiService} from "../../../services/api.service";

interface ChannelModalVariables {
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
export class ChannelsComponent implements OnInit, OnDestroy {
  @Input({required: true}) selectedChatId: number | null = null
  @Output() selectChat = new EventEmitter<SelectedChatType>()
  channels$: Observable<Channel[]>

  modalVariables: ChannelModalVariables = {
    visible: false,
    searchString: new FormControl(''),
    filteredData: []
  }

  private store = inject(Store)
  private destroy$ = new Subject<void>()

  constructor(private apiService: ApiService) {
    this.channels$ = this.store.select(state => state.channels.value)

  }

  onSelectChat(id: number) {
    this.selectChat.emit({id: id, type: "channel"})
  }


  onSelectChannel(channelId: number) {
    this.apiService.connectUserToChannel(channelId).subscribe({
      next: () => {
        this.store.dispatch(loadChannels())
        this.modalVariables = {
          visible: false,
          searchString: new FormControl(''),
          filteredData: this.modalVariables.filteredData.filter((item) => item.id !== channelId)
        }
      }
    })
  }

  ngOnInit(): void {
    this.store.dispatch(loadChannels())

    combineLatest([
      this.apiService.getChannelsWithoutCurrentUser().pipe(startWith([])),
      this.modalVariables.searchString.valueChanges.pipe(startWith(''))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([channels, searchString]) => {
      this.modalVariables.filteredData = searchString
        ? channels.filter(channel => channel.name.toLowerCase().includes(searchString.toLowerCase()))
        : channels
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
