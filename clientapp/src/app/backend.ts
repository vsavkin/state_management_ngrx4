import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {of} from "rxjs/observable/of";
import {Injectable} from "@angular/core";
import {Filters, Talk} from "./model";

@Injectable()
export class Backend {
  private url = 'http://localhost:4444';
  talks: Talk[] = [];
  filters: Filters = {speaker: null, title: null, minRating: 0};

  constructor(private http: Http) {
    this.refetch();
  }

  findTalk(id: number): Observable<Talk> {
    const cachedTalks = this.talks ? this.talks.filter(t => t.id === id) : [];
    if (cachedTalks.length > 0) {
      return of(cachedTalks[0]);
    }

    const params = new URLSearchParams();
    params.set("id", id.toString());
    return this.http.get(`${this.url}/talk/`, {search: params}).map(r => r.json()['talk']);
  }

  rateTalk(talk: Talk, rating: number): void {
    this.http.post(`${this.url}/rate`, {id: talk.id, yourRating: rating}).forEach(() => {})
  }

  changeFilters(filters: Filters): void {
    this.filters = filters;
    this.refetch();
  }

  private refetch(): void {
    const params = new URLSearchParams();
    params.set("speaker", this.filters.speaker);
    params.set("title", this.filters.title);
    params.set("minRating", this.filters.minRating.toString());
    this.http.get(`${this.url}/talks`, {search: params}).map(r => r.json()['talks']).forEach((talks) => {
      this.talks = talks;
    });
  }
}