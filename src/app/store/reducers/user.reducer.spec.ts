import { userReducer, initialState, UserState } from './user.reducer';
import * as UserActions from '../actions/user.actions';
import { User } from '../model/user.model';

describe('User Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const state = userReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('loadUsersSuccess action', () => {
    it('should populate the user list', () => {
      const users: User[] = [{id: 1, username: 'Alice', password: '1234131', is_online: false}];
      const action = UserActions.loadUsersSuccess({ value: users });
      const expectedState: UserState = {
        value: users,
        error: null
      };

      const state = userReducer(initialState, action);

      expect(state).toEqual(expectedState);
    });
  });

  describe('loadUsersFailure action', () => {
    it('should store the error', () => {
      const error = 'Some error';
      const action = UserActions.loadUsersFailure({ error });
      const expectedState: UserState = {
        value: [],
        error: error
      };

      const state = userReducer(initialState, action);

      expect(state).toEqual(expectedState);
    });
  });
});
