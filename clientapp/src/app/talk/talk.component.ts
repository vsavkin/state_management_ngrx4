import {Component, Input} from "@angular/core";
import {Talk} from "../model";

@Component({
  selector: 'talk-cmp',
  templateUrl: './talk.component.html',
  styleUrls: ['./talk.component.css']
})
export class TalkComponent {
  @Input() talk: Talk;
}