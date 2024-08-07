import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-input-label-container',
  standalone: true,
  imports: [],
  template: `
    <div [class]="'flex flex-col gap-2 ' + styleClass"><ng-content /></div>
  `,
})
export class InputLabelContainerComponent {
  @Input() styleClass: string = ''
}
