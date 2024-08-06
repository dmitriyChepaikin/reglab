import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import {User} from "../model/user.model";

export interface UserState {
  value: User[];
  error: any;
}

export const initialState: UserState = {
  value: [],
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsersSuccess, (state, { value }) => ({ ...state, value: value })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, error }))
);
