import {createReducer, on} from '@ngrx/store';
import * as MessageActions from '../actions/message.actions';
import {Message} from "../model/message.model";

export interface MessageState {
  value: Message[];
  error: any;
}

export const initialState: MessageState = {
  value: [],
  error: null
};

export const messageReducer = createReducer(
  initialState,
  on(MessageActions.loadMessageSuccess, (state, {value}) => ({...state, value: value})),
  on(MessageActions.loadMessageFailure, (state, {error}) => ({...state, error}))
);
