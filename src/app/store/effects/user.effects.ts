import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import * as UserActions from '../actions/user.actions';
import {ApiService} from '../../services/api.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);

  constructor(
    private apiService: ApiService
  ) {
  }

  loadUsers = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loadUsers),
    mergeMap(() => this.apiService.getUsersWithCurrentUser()
      .pipe(
        map(value => UserActions.loadUsersSuccess({value})),
        catchError(error => of(UserActions.loadUsersFailure({error})))
      ))
  ));
}
