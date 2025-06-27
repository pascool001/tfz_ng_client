import { Component, effect, inject } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthStore } from '@stores/security_store';
import { HeaderMenuComponent, Menu } from '../header-menu/header-menu.component';
import { JsonPipe } from '@angular/common';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ProfileComponent,
    HeaderMenuComponent,
    RouterOutlet,
    RouterModule,
    JsonPipe
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  

  menu_items: Menu[] = [
    {
      main_menu: 'Parametres',
      sous_menus: [
        {label: 'Gestion pays (parameters)', path: '/backoffice/country' },
        {label: 'Opérateurs par pays', path: '/backoffice/country_operators' },
        {label: 'Opérateurs fintech', path: '/backoffice/operator' },
        {label: 'Services partenaires', path: '/backoffice/partner_service'  },
      ]
  },
    {
      main_menu: 'Admin. users',
      sous_menus: [
        {label: 'Mobile ', path: '/backoffice/mobile_user' },
        {label: 'Backoffice', path: '/backoffice/bo_user' },
        {label: 'Partenaire service', path: '/backoffice/service_user' },
      ]
    },
    {
      main_menu: 'Suivi & Statistiques',
      sous_menus: [
        {label: 'Compte mobile', path: '/backoffice/account' },
        {label: 'transferts', path: '/backoffice/transferts' },
        {label: 'Souscriptions', path: '/backoffice/subscription' },
      ]
    },
  ]


  _authStore = inject(AuthStore)
  isBo: boolean = false
  constructor(private router: Router) {
    effect( () => {
      if (!this._authStore.authenticated()) {
        this.router.navigate(['/security/auth'])
      }
      if (this._authStore.authenticated()) {
        if (['BackofficeAdmin', 'Backoffice'].includes( this._authStore.currentUser?.profile() )   ) {
            this.isBo = true
        } else {
          this.isBo = false
        }
      }
    })
  }


  // disconnect() {
  //   this._authStore.logout();
  // }

}
