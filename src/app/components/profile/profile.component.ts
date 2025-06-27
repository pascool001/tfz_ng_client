import { Component, OnInit, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '@stores/security_store';
import { initFlowbite } from 'flowbite';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXCircle, heroBanknotes, heroUser, heroCog8Tooth, heroPresentationChartBar } from '@ng-icons/heroicons/outline';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, NgIcon],
  viewProviders: [provideIcons({heroXCircle, heroBanknotes, heroUser, heroCog8Tooth, heroPresentationChartBar })],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  _authStore = inject(AuthStore)


  constructor(private router: Router) {
    effect( () => {
      if (!this._authStore.authenticated() ) {
        console.log("disconnected !!!!!!!")
        this.router.navigate(['/security/auth'])
      }
    })

  }

  ngOnInit(): void {
    initFlowbite()
  }

  disconnect() {
     this._authStore.logout();
  }
}
