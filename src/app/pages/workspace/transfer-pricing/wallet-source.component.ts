import { Component, effect, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IWallet } from '@models/wallet';
import { WalletStore } from '@stores/wallet_store';

@Component({
  selector: 'app-wallet-source',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  template: `
      <!-- <button [matMenuTriggerFor]="menu" type="button" class="text-white bg-lime-700 hover:bg-lime-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-green-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Wallet source

      </button> -->
      <button id="dropdownDefaultButton" [matMenuTriggerFor]="menu" class="text-white  bg-lime-700 hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Wallet source
        <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      <mat-menu #menu="matMenu">
        @for(w of walletList; track w) {
          <button mat-menu-item (click)="onSelect(w)" >
            <div class="flex flex-row justify-start content-center items-center">
              <div class="">
                <img src="data:image/{{w.wallet_logo_filename.split('.')[1]}};base64,{{w.wallet_logo}}" class="rounded-full w-10 h-10"  alt="logo2" >
              </div>
              <div class="flex flex-1 justify-start content-center text-center pl-2">
                <span> {{w.wallet_name}} </span>
              </div>
            </div>

          </button>
        }
      </mat-menu>
  `,
  styles: ``
})
export class WalletSourceComponent {
  wallet_store = inject(WalletStore)
  walletList: IWallet[] = []
  onselect = output<IWallet>()


  constructor(){
    effect(() => {
      this.walletList = this.wallet_store.walletList()
    })
  }

  onSelect(w:IWallet) {
    this.onselect.emit(w)
  }

}


