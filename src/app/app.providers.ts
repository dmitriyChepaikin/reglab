import { ConfirmationService, MessageService } from 'primeng/api'

export const appProviders = [
  {
    provide: ConfirmationService,
  },
  {
    provide: MessageService,
  },
]
