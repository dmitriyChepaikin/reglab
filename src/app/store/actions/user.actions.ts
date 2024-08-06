import { createAction, props } from '@ngrx/store';
import {User} from "../model/user.model";

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ value: User[] }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: any }>());
