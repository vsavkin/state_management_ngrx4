import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'watch-button',
  templateUrl: './watch-button.component.html',
  styleUrls: ['./watch-button.component.scss']
})
export class WatchButtonComponent {

  @Input() watched: boolean;
  @Output() watch: EventEmitter<any> = new EventEmitter();

  handleWatch() {
    this.watch.emit();
  }

}
