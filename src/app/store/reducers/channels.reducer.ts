import {createReducer, on} from '@ngrx/store';
import * as ChannelActions from '../actions/channels.actions';
import {Channel} from "../model/channel.model";

export interface ChannelState {
  value: Channel[];
  error: any;
}

export const initialState: ChannelState = {
  value: [],
  error: null
};

export const channelsReducer = createReducer(
  initialState,
  on(ChannelActions.loadChannelsSuccess, (state, {value}) => ({...state, value: value})),
  on(ChannelActions.loadChannelsFailure, (state, {error}) => ({...state, error}))
);
