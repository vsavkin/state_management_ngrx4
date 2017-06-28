import {Talk} from "./model";

export class WatchService {
  watched: {[k: number]: boolean} = {};

  watch(talk: Talk): void {
    console.log("watch", talk.id);
    this.watched[talk.id] = true;
  }

  isWatched(talk: Talk): boolean {
    return this.watched[talk.id];
  }
}