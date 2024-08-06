import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import * as ChannelActions from '../actions/channels.actions';
import {ApiService} from '../../services/api.service';

@Injectable()
export class ChannelsEffects {
  private actions$ = inject(Actions);

  constructor(
    private apiService: ApiService
  ) {
  }

  loadChannels = createEffect(() => this.actions$.pipe(
    ofType(ChannelActions.loadChannels),
    mergeMap(() => this.apiService.getChannels()
      .pipe(
        map(value => ChannelActions.loadChannelsSuccess({value})),
        catchError(error => of(ChannelActions.loadChannelsFailure({error})))
      ))
  ));
}
