import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styles: ``
})
export class LandingComponent {

  router = inject(Router)

  loadSecurity() {
    this.router.navigate(['/security'])
  }


}
