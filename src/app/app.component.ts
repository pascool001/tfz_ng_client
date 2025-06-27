import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('enter', [
        transition(':enter', [
            style({ opacity: 0, scale: 0.7 }),
            animate('400ms ease-in', style({ opacity: 1, scale: 1 }))
        ])
    ])
  ]
})
export class AppComponent implements OnInit {

  constructor() {

  }

 ngOnInit(): void {
   initFlowbite()
 }
}
