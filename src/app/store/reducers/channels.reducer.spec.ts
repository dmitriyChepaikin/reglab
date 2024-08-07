import { channelsReducer, initialState, ChannelState } from './channels.reducer';
import * as ChannelActions from '../actions/channels.actions';
import { Channel } from '../model/channel.model';

describe('Channels Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const state = channelsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('loadChannelsSuccess action', () => {
    it('should populate the channel list', () => {
      const channels: Channel[] = [{ id: 1, name: 'General' }];
      const action = ChannelActions.loadChannelsSuccess({ value: channels });
      const expectedState: ChannelState = {
        value: channels,
        error: null
      };

      const state = channelsReducer(initialState, action);

      expect(state).toEqual(expectedState);
    });
  });

  describe('loadChannelsFailure action', () => {
    it('should store the error', () => {
      const error = 'Some error';
      const action = ChannelActions.loadChannelsFailure({ error });
      const expectedState: ChannelState = {
        value: [],
        error: error
      };

      const state = channelsReducer(initialState, action);

      expect(state).toEqual(expectedState);
    });
  });
});
