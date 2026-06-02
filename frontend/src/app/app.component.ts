import { Component } from '@angular/core';
import { BusListComponent } from './components/bus-list/bus-list.component';
import { PopupComponent } from './components/popup/popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BusListComponent, PopupComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bus Timetable';
}
