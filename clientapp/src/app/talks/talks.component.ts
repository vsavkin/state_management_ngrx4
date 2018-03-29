import { Component, Input } from '@angular/core';
import { Talk } from '../model';

@Component({
  selector: 'talks-cmp',
  templateUrl: './talks.component.html',
  styleUrls: ['./talks.component.scss']
})
export class TalksComponent {
  @Input() talks: Talk[];
}
