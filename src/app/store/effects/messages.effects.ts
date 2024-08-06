import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import * as MessageActions from '../actions/message.actions';
import {ApiService} from '../../services/api.service';

@Injectable()
export class MessageEffects {

  private actions$ = inject(Actions);

  constructor(
    private apiService: ApiService
  ) {
  }

  loadMessages = createEffect(() => this.actions$.pipe(
    ofType(MessageActions.loadMessages),
    mergeMap(() => this.apiService.getMessages()
      .pipe(
        map(value => MessageActions.loadMessageSuccess({value})),
        catchError(error => of(MessageActions.loadMessageFailure({error})))
      ))
  ));
}
