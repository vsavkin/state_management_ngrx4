import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Filters, Talk} from "./model";

@Injectable()
export class Backend {
  private url = 'http://localhost:4444';

  constructor(private http: Http) {}

  findTalks(filters: Filters): Observable<{talks: {[id: number]: Talk}, list: number[]}> {
    const params = new URLSearchParams();
    params.set("speaker", filters.speaker);
    params.set("title", filters.title);
    params.set("minRating", filters.minRating.toString());
    return this.http.get(`${this.url}/talks`, {search: params}).map(r => r.json());
  }

  findTalk(id: number): Observable<Talk> {
    const params = new URLSearchParams();
    params.set("id", id.toString());
    return this.http.get(`${this.url}/talk/`, {search: params}).map(r => r.json()['talk']);
  }

  rateTalk(id: number, rating: number): Observable<any> {
    return this.http.post(`${this.url}/rate`, {id, yourRating: rating});
  }
}