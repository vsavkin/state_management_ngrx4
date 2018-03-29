import { Component } from '@angular/core';
import { Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Filters, State, Talk, AppState } from '../model';

@Component({
  selector: 'talks-and-filters-cmp',
  templateUrl: './talks-and-filters.component.html',
  styleUrls: ['./talks-and-filters.component.scss']
})
export class TalksAndFiltersComponent {

  talks: Observable<Talk[]>;
  filters: Observable<Filters>;

  constructor(private router: Router, private store: Store<State>) {
    this.filters = store.pipe(select('app', 'filters'));
    this.talks = store.pipe(
      select('app'),
      map((t: AppState) => t.list.map(y => t.talks[y])));
  }

  handleFiltersChange(filters) {
    this.router.navigate(['/talks', this.createParams(filters)]);
  }

  createParams(filters: Filters) {
    const r: any = {};
    if (filters.speaker) r.speaker = filters.speaker;
    if (filters.title) r.title = filters.title;
    if (filters.minRating) r.minRating = filters.minRating;
    return r;
  }
}
