import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Filters } from '../model';

@Component({
  selector: 'filters-cmp',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {

  @Output() filtersChange = new EventEmitter();

  @Input() set filters(v) {
    this.filtersForm.setValue({
      title: v.title,
      speaker: v.speaker,
      highRating: v.minRating >= 9
    }, { emitEvent: false });
  }

  filtersForm = new FormGroup({
    title: new FormControl(),
    speaker: new FormControl(),
    highRating: new FormControl(false)
  });

  constructor() {
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(200)
      )
      .subscribe(value => {
        this.filtersChange.emit(this.createFiltersObject(value))
      });
  }

  private createFiltersObject({ title, speaker, highRating }: { title: string, speaker: string, highRating: false }): Filters {
    const minRating = highRating ? 9 : 0;
    return { speaker: speaker || null, title: title || null, minRating: minRating };
  }

}
