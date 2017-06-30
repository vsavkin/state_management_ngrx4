import {RouterAction, ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {Actions, Effect} from '@ngrx/effects';
import {WatchService} from "app/watch";
import {Backend} from "app/backend";
import {Params, ActivatedRouteSnapshot} from "@angular/router";
import {Store, combineReducers} from "@ngrx/store";
import {Injectable} from "@angular/core";
import {of} from "rxjs/observable/of";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/withLatestFrom';

// state
export type Talk = { id: number, title: string, speaker: string, description: string, yourRating: number, rating: number };
export type Filters = { speaker: string, title: string, minRating: number };
export type AppState = { talks: { [id: number]: Talk }, list: number[], filters: Filters, watched: { [id: number]: boolean } };
export type State = { app: AppState }; // this will also contain router state

export const initialState: State = {
  app: {
    filters: {speaker: "", title: "", minRating: 0},
    talks: {},
    list: [],
    watched: {}
  }
};

// actions
export type TalksUpdated = { type: 'TALKS_UPDATED', payload: { talks: { [id: number]: Talk }, list: number[] }, filters: Filters };
export type TalkUpdated = { type: 'TALK_UPDATED', payload: Talk };
export type Watch = { type: 'WATCH', payload: { talkId: number } };
export type TalkWatched = { type: 'TALK_WATCHED', payload: { talkId: number } };
export type Rate = { type: 'RATE', payload: { talkId: number, rating: number } };
export type Unrate = { type: 'UNRATE', payload: { talkId: number, error: any } };
type Action = RouterAction<State> | TalksUpdated | TalkUpdated | Watch | TalkWatched | Rate | Unrate;

// reducer
export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TALKS_UPDATED': {
      return {...state, ...action.payload};
    }
    case  'TALK_UPDATED': {
      const talks = {...state.talks};
      talks[action.payload.id] = action.payload;
      return {...state, talks};
    }
    case 'RATE': {
      const talks = {...state.talks};
      talks[action.payload.talkId].rating = action.payload.rating;
      return {...state, talks};
    }
    case 'UNRATE': {
      const talks = {...state.talks};
      talks[action.payload.talkId].rating = null;
      return {...state, talks};
    }
    case 'TALK_WATCHED': {
      const watched = {...state.watched};
      watched[action.payload.talkId] = true;
      return {...state, watched};
    }
    default: {
      return state;
    }
  }
}

@Injectable()
export class TalksEffects {
  @Effect() navigateToTalks = this.handleNavigation('talks', (r: ActivatedRouteSnapshot) => {
    const filters = createFilters(r.params);
    return this.backend.findTalks(filters).map(resp => ({type: 'TALKS_UPDATED', payload: {...resp, filters}}));
  });

  @Effect() navigateToTalk = this.handleNavigation('talk/:id', (r: ActivatedRouteSnapshot, state: State) => {
    const id = +r.paramMap.get('id');
    if (! state.app.talks[id]) {
      return this.backend.findTalk(+r.paramMap.get('id')).map(resp => ({type: 'TALK_UPDATED', payload: resp}));
    } else {
      return of();
    }
  });

  @Effect() rateTalk = this.actions.ofType('RATE').
    switchMap((a: Rate) => {
      return this.backend.rateTalk(a.payload.talkId, a.payload.rating).switchMap(() => of()).catch(e => {
        console.log('Error', e);
        return of({type: 'UNRATE', payload: {talkId: a.payload.talkId}});
      });
    });

  @Effect() watchTalk = this.actions.ofType('WATCH').
    map((a: Watch) => {
      this.watch.watch(a.payload.talkId);
      return {type: 'TALK_WATCHED', payload: a.payload};
    });

  constructor(private actions: Actions, private store: Store<State>, private backend: Backend, private watch: WatchService) {
  }

  private handleNavigation(segment: string, callback: (a: ActivatedRouteSnapshot, state: State) => Observable<any>) {
    const nav = this.actions.ofType(ROUTER_NAVIGATION).
      map(firstSegment).
      filter(s => s.routeConfig.path === segment);

    return nav.withLatestFrom(this.store).switchMap(a => callback(a[0], a[1])).catch(e => {
      console.log('Network error', e);
      return of();
    });
  }
}


function firstSegment(r: RouterNavigationAction) {
  return r.payload.routerState.root.firstChild;
}


function createFilters(p: Params): Filters {
  return {speaker: p['speaker'] || null, title: p['title'] || null, minRating: p['minRating'] ? +p['minRating'] : 0};
}
