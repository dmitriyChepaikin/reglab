import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {AvatarModule} from "primeng/avatar";
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {User} from "../../../store/model/user.model";
import {Channel} from "../../../store/model/channel.model";
import {Observable, switchMap} from "rxjs";
import {Message, UserMessage} from "../../../store/model/message.model";
import {LocalStorageService} from "../../../services/localStorage.service";


@Component({
  selector: 'app-chat-messages-window',
  standalone: true,
  imports: [
    AvatarModule,
    Button,
    FormsModule,
    InputTextareaModule,
    OverlayPanelModule
  ],
  templateUrl: './messages-window.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesWindowComponent implements OnChanges {
  @Input({required: true}) selectedUserOrChannel: User | Channel | null = null
  @ViewChild('messagesScroll') private messagesContainer!: ElementRef
  @ViewChild('messageTextRef') private messageTextRef!: ElementRef
  messages$?: Observable<{ messages: UserMessage[], channelId: number | null }>


  currentUserId: number | null = null
  messages: UserMessage[] = []
  messageText = ''
  channelId: number | null = null

  isChannelType(chat: User | Channel | null): chat is Channel {
    return chat !== null && 'name' in chat;
  }

  constructor(
    private apiService: ApiService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
  ) {
    this.currentUserId = this.localStorageService.getUser()?.id || null
  }

  get userChatName() {
    return !this.isChannelType(this.selectedUserOrChannel) && this.selectedUserOrChannel?.username
  }

  inputOverflow(state: boolean) {
    state
      ? this.renderer.addClass(
        this.messageTextRef.nativeElement,
        '!overflow-auto'
      )
      : this.renderer.removeClass(
        this.messageTextRef.nativeElement,
        '!overflow-auto'
      )
  }

  sendMessage() {
    const trimmedMsg = this.messageText.trim()
    if (!trimmedMsg || !this.currentUserId || !this.channelId) return
    const message = {
      id: Date.now(),
      from_user: this.currentUserId,
      channel_id: this.channelId,
      content: this.messageText
    }

    this.apiService.sendMessageToChannel(message as Message).subscribe({
      next: () => {
        this.fetchMessages()
      }
    })
    this.messageText = ''
  }

  /** Скролл в самый низ блока - для чатов */
  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight
    } catch (err) {
      console.error('Could not scroll to bottom in messagesContainer')
    }
  }

  handleTextareaKeyDown(event: KeyboardEvent): void {
    /** Отправка сообщения */
    if (event.key === 'Enter' && !event.altKey) {
      event.preventDefault()
      this.sendMessage()
    }

    const height = this.messageTextRef.nativeElement.offsetHeight

    /** Максимальная высота инпута без скролла */
    const maxHeight = 100

    if (height < maxHeight) this.inputOverflow(false)

    /** Перенос строки и добавление скролла если элемент высокий */
    if (event.key === 'Enter' && event.altKey) {
      // Для Alt + Enter добавляем символ переноса строки в текущую позицию курсора
      const currentPosition = (event.target as HTMLTextAreaElement)
        .selectionStart
      const before = this.messageText.slice(0, currentPosition)
      const after = this.messageText.slice(currentPosition)

      if (height > maxHeight) this.inputOverflow(true)

      this.messageText = `${before}\n${after}`
      // Асинхронно обновляем позицию курсора после применения изменений в модели
      requestAnimationFrame(() => {
        (event.target as HTMLTextAreaElement).selectionStart = (
          event.target as HTMLTextAreaElement
        ).selectionEnd = currentPosition + 1
        this.messageTextRef.nativeElement.scrollTop =
          this.messageTextRef.nativeElement.scrollHeight
      })
    }
  }

  fetchMessages(): void {
    this.messages$ = this.isChannelType(this.selectedUserOrChannel)
      ? this.apiService.getChannelMessages(this.selectedUserOrChannel.id)
      : this.apiService.getMessagesWithUser(this.selectedUserOrChannel?.id!);

    this.messages$
      .pipe(
        switchMap(data => {
          this.messages = data.messages
          this.channelId = data.channelId
          this.cdr.detectChanges()
          this.scrollToBottom()
          return []
        })
      )
      .subscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUserOrChannel'].currentValue !== changes['selectedUserOrChannel'].previousValue) {
      this.fetchMessages()
    }
  }
}
