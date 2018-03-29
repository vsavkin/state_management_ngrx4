import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { RouterAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Backend } from './backend';
import { map, filter, withLatestFrom, switchMap, catchError } from 'rxjs/operators';

// state
export type Talk = { id: number, title: string, speaker: string, description: string, yourRating: number, rating: number };
export type Filters = { speaker: string, title: string, minRating: number };
export type AppState = { talks: { [id: number]: Talk }, list: number[], filters: Filters, watched: { [id: number]: boolean } };
export type State = { app: AppState }; // this will also contain router state

export const initialState: State = {
    app: {
        talks: {},
        list: [],
        filters: {
            speaker: "",
            minRating: 0,
            title: ""
        },
        watched: []
    }
}

export type TalksUpdated = { type: 'TALKS_UPDATED', payload: { talks: { [id: number]: Talk }, list: number[], filters: Filters } };
export type TalkUpdated = { type: 'TALK_UPDATED', payload: Talk };
export type Watch = { type: 'WATCH', payload: { talkId: number } };
export type TalkWatched = { type: 'TALK_WATCHED', payload: { talkId: number } };
export type Rate = { type: 'RATE', payload: { talkId: number, rating: number } };
export type UnRate = { type: 'UNRATE', payload: { talkId: number }, error: any };
type Action = TalksUpdated | TalkUpdated | Watch | TalkWatched | Rate | UnRate | RouterAction<State>;

export function appReducer(state: AppState, action): AppState {
    switch (action.type) {
        case 'TALKS_UPDATED': {
            return { ...state, ...action.payload };
        }
        case 'TALK_UPDATED': {
            const talks = { ...state.talks };
            talks[action.payload.id] = action.payload;
            return { ...state, talks };
        }
        case 'TALK_WATCH': {
            const watched = { ...state.watched };
            watched[action.payload.talkId] = true;
            return { ...state, watched };
        }
        case 'RATE': {
            const talks = { ...state.talks };
            talks[action.payload.talkId].rating = action.payload.rating;
            return { ...state, talks };
        }
        case 'UNRATE': {
            const talks = { ...state.talks };
            talks[action.payload.talkId].rating = null;
            return { ...state, talks };
        }
        default: {
            return state;
        }
    }
}

@Injectable()
export class TalksEffects {

    @Effect() navigateToTalks = this.handleNavigation('talks', (r: ActivatedRouteSnapshot, s: State) => {
        const filters = createFilters(r.params);
        return this.backend
            .findTalks(filters)
            .pipe(
                map(resp => ({ type: 'TALKS_UPDATED', payload: { ...resp, filters } })
                )
            );
    });

    @Effect() navigateToTalk = this.handleNavigation('talk/:id', (r: ActivatedRouteSnapshot, s: State) => {
        const id = +r.paramMap.get('id');
        if (!s.app.talks[id]) {
            return this.backend
                .findTalk(id).pipe(
                    map(resp => ({ type: 'TALK_UPDATED', payload: resp['talk'] }))
                );
        }
        return of();
    });

    @Effect() rateTalk = this.actions$.pipe(
        ofType('RATE'),
        switchMap((r: Rate) => {
            return this.backend
                .rateTalk(r.payload.talkId, r.payload.rating)
                .pipe(
                    switchMap(resp => of()),
                    catchError(error => {
                        console.log(error);
                        return of({ type: 'UNRATE', payload: { talkId: r.payload.talkId } });
                    })
                )
        })
    )

    @Effect() watchTalk = this.actions$
        .pipe(
            ofType('WATCH'),
            map((p: Watch) => {
                const talkId = p.payload.talkId;
                //do anything you want
                return ({ type: 'TALK_WATCH', payload: p.payload });
            }));

    constructor(
        private actions$: Actions,
        private router: ActivatedRoute,
        private store: Store<State>,
        private backend: Backend) {
    }

    private handleNavigation(segment: string, callback: (a: ActivatedRouteSnapshot, state: State) => Observable<any>) {

        return this.actions$
            .pipe(
                ofType(ROUTER_NAVIGATION),
                map((r: RouterNavigationAction) => r.payload.routerState.root.firstChild),
                filter(s => s.routeConfig.path === segment),
                withLatestFrom(this.store),
                switchMap(a => callback(a[0], a[1])),
                catchError(e => {
                    console.log('Network error -', e);
                    return of();
                })
            );

    }
}

function createFilters(p: Params): Filters {
    return { speaker: p['speaker'] || null, title: p['title'] || null, minRating: p['minRating'] ? +p['minRating'] : 0 };
}