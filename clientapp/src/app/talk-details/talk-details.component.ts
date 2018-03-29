import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State, Talk, AppState } from '../model';

@Component({
  selector: 'talk-details-cmp',
  templateUrl: './talk-details.component.html',
  styleUrls: ['./talk-details.component.scss']
})
export class TalkDetailsComponent {

  talk: Talk;
  watched: boolean;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>) {

    store.pipe(
      select('app')
    ).subscribe((x: AppState) => {
      const id = +route.snapshot.paramMap.get('id');
      this.talk = x.talks[id];
      this.watched = x.watched[id];
    });

  }

  handleRating(newRating: number) {
    this.store.dispatch({
      type: 'RATE',
      payload: {
        talkId: this.talk.id,
        rating: newRating
      }
    });
  }

  handleWatch() {
    this.store.dispatch({
      type: 'WATCH',
      payload: {
        talkId: this.talk.id
      }
    });
  }
}
