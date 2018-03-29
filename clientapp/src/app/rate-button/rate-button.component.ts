import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Talk } from '../model';

@Component({
  selector: 'rate-button',
  templateUrl: './rate-button.component.html',
  styleUrls: ['./rate-button.component.scss']
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