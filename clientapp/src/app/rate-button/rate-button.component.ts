import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Talk} from "../model";

@Component({
  selector: 'rate-button',
  templateUrl: './rate-button.component.html'
})
export class RateButtonComponent {
  @Input() talk: Talk;
  @Output() rate = new EventEmitter();

  promptRating(): void {
    const value = prompt("Enter rating");
    if (value) {
      this.rate.next(+value);
    }
  }
}
