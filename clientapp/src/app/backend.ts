import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Talk, Filters } from "./model";

@Injectable()
export class Backend {

    private url = "http://localhost:4444";
    constructor(private http: HttpClient) { }

    findTalks(filter: Filters): Observable<{ talks: { [id: number]: Talk }, list: number[] }> {

        const params = Object.keys(filter).reduce((acc, curr) => {
            return !!filter[curr] ? acc.set(curr, filter[curr]) : acc;
        }, new HttpParams());

        return this.http
            .get<{ talks: { [id: number]: Talk }, list: number[] }>(`${this.url}/talks`, { params: params });
    }

    findTalk(id: number) {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get(`${this.url}/talk`, { params: params });
    }

    rateTalk(id: number, rating: number) {
        return this.http.post(`${this.url}/rate`, { id, yourRating: rating });
    }
}