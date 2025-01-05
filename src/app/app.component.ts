import { Component } from '@angular/core';
import {VisualizerComponent} from "./components/visualizer/visualizer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    VisualizerComponent
  ],
  template: '<app-visualizer></app-visualizer>'
})
export class AppComponent { }
