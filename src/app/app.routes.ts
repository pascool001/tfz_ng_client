import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthComponent } from './pages/security/auth/auth.component';
import { ForgottenPwdComponent } from './pages/security/forgotten-pwd/forgotten-pwd.component';
import { ResetPwdComponent } from './pages/security/reset-pwd/reset-pwd.component';
import { SettingsComponent } from '@pages/workspace/settings/settings.component';
import { CountryComponent, ProfilComponent, ServiceComponent, TypeTransferComponent } from '@pages/workspace';
import { WalletComponent } from '@pages/workspace/wallet/wallet.component';
import { WalletTransfPricingComponent } from '@pages/workspace/wallet-transf-pricing/wallet-transf-pricing.component';


export const routes: Routes = [
    {
        path:'',
        redirectTo: '/security',
        pathMatch: 'full'
    },
    {
      path: 'security',
      loadComponent: () => import('./pages/security/secu-layout/secu-layout.component').then((m) => m.SecuLayoutComponent),
      children: [
      {
          path:'',
          redirectTo: '/security/auth',
          pathMatch: 'full',
          title: 'Authentication'
      },
      {
          path: 'auth',
          component: AuthComponent,
          title: 'Authentication'
      },
      {
          path: 'forgotten-pwd',
          component: ForgottenPwdComponent,
          title: 'Password reset request'
      },
      {
          path: 'reset-pwd',
          component: ResetPwdComponent,
          title: 'Password reset',
      }
      ]
    },
    {
        path: 'workspace',
        loadComponent: () => import('./pages/workspace/ws-layout/ws-layout.component').then((m) => m.WsLayoutComponent ),
        children: [
        {
            path:'',
            redirectTo: '/workspace/settings',
            pathMatch: 'full',
            title: 'settings'
        },
        {
          path: 'settings',
          component: SettingsComponent,
          title: 'Settings',
          children: [
            {
              path:'',
              redirectTo: '/workspace/settings/country',
              pathMatch: 'full',
              title: 'setting country'
            },
            {
              path: 'country',
              component: CountryComponent,
              title:'setting country',
            },
            {
              path: 'profil',
              component: ProfilComponent,
              title:'setting profil',
            },
            {
              path: 'service',
              component: ServiceComponent,
              title:'setting service',
            },

            {
              path: 'transfer-type',
              component: TypeTransferComponent,
              title:'setting Transfert type',
            },
            {
              path: 'wallet',
              component: WalletComponent,
              title:'setting wallet',
            },
            {
              path: 'wallet-pricing',
              component: WalletTransfPricingComponent,
              title:'Wallet transf. pricing',
            },
          ]


      },
      ]
    },
    {path: '**', component: PageNotFoundComponent}
  ];


