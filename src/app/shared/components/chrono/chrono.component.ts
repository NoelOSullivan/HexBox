import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-chrono',
    imports: [],
    templateUrl: './chrono.component.html',
    styleUrl: './chrono.component.scss'
})
export class ChronoComponent {

  @Input() chrono!: string;

}
