import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
 styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }
  `]
})
export class Icon {
  @Input({ required: true }) name!: string; // שם האייקון (edit, trash וכו')
  @Input() size: number = 20;               // גודל בפיקסלים
  @Input() strokeWidth: number = 2;

}
