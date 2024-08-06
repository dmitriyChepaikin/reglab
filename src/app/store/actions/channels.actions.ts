import {createAction, props} from '@ngrx/store';
import {Channel} from "../model/channel.model";

export const loadChannels = createAction('[Channels] Load Channels');
export const loadChannelsSuccess = createAction('[Channels] Load Channels Success', props<{ value: Channel[] }>());
export const loadChannelsFailure = createAction('[Channels] Load Channels Failure', props<{ error: any }>());
