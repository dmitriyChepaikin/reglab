import { createAction, props } from '@ngrx/store';
import {Message} from "../model/message.model";

export const loadMessages = createAction('[Messages] Load Messages');
export const loadMessageSuccess = createAction('[Messages] Load Messages Success', props<{ value: Message[] }>());
export const loadMessageFailure = createAction('[Messages] Load Messages Failure', props<{ error: any }>());
