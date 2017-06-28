import {Component, Inject} from "@angular/core";
import {Backend} from "../backend";
import {Router, ActivatedRoute} from "@angular/router";
import { Filters, createFiltersObject } from "../model";

@Component({
  selector: 'app-cmp',
  templateUrl: './talks-and-filters.component.html',
  styleUrls: ['./talks-and-filters.component.css']
})
export class TalksAndFiltersComponent {
  constructor(public app: Backend) {}

  handleFiltersChange(filters: Filters): void {
    this.app.changeFilters(filters);
  }
}
