export type Message = {
  id: number
  from_user: number
  channel_id: number
  content: string
}

export type UserMessage = Message & { username?: string }
