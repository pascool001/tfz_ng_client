import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService } from '@utilities';
import { AuthStore } from '@stores/security_store';
import { getState } from '@ngrx/signals';


@Component({
  selector: 'app-secu-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './secu-layout.component.html',
  styleUrl: './secu-layout.component.css'
})
export class SecuLayoutComponent {
  _localStorageService = inject(LocalStorageService)
  _authStore = inject(AuthStore)
  constructor() {
    effect(() => {
      // console.log('Secu layout authStore: ', getState(this._authStore))
      this._localStorageService.setItem('authStore', getState(this._authStore));
    })
  }
}
