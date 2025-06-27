import { Dialog } from '@angular/cdk/dialog';
import { Component, effect, inject } from '@angular/core';
// import { Router } from '@angular/router';
import { IWallet } from '@models/wallet';
import { WalletStore } from '@stores/wallet_store';
import Swal from 'sweetalert2';
import { WalletFormDlgComponent } from './wallet-form-dlg.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEllipsisVertical, heroMagnifyingGlass, heroPencilSquare, heroPlus, heroXCircle } from '@ng-icons/heroicons/outline';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { CountrySelectComponent } from './country-select.component';
import { CountryStore } from '@stores/country_store';


@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    NgIcon,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    CountrySelectComponent,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
  ],
  viewProviders: [provideIcons({ heroEllipsisVertical, heroPlus, heroMagnifyingGlass ,heroPencilSquare, heroXCircle })],
  templateUrl: './wallet.component.html',
  styles: ``
})
export class WalletComponent {

    private dialog = inject(Dialog);

    walletData: IWallet = {_id: '', country: "", wallet_logo: '', wallet_name: '', wallet_logo_filename: '' }

    wallet_store = inject(WalletStore)

    country_store = inject(CountryStore)

    wallets:IWallet[] = []

    headers: (string|undefined)[] = [ "-", "name", "Actions" ]

    showSpinner: boolean = false;

    searchText: string=""

    title = "List of wallet"

    currentCountryId: string|undefined = "";

    constructor() {
      effect(() => {
        this.currentCountryId = this.country_store.selectedId()
        this.wallets = this.wallet_store.filtered()
        this.showSpinner = this.wallet_store.loading()
      })
    }

    ngOnInit(): void {
      this.wallet_store.getAll()
    }

    update(obj:IWallet) {
      this.dialog.open(WalletFormDlgComponent, {data: obj}).closed.subscribe(result => {
          const data = result as IWallet;
          if (data && data?._id) {
            this.wallet_store.update(data, data._id)
          }
      });
    }

    add(){
      this.dialog.open(WalletFormDlgComponent).closed.subscribe((result) => {
        const newData = {...(result as IWallet), country: this.currentCountryId }
        if (result) this.wallet_store.add(newData as IWallet)
      });
    }

    handleQuery(){
      this.wallet_store.updateQuery(this.searchText)
    }

    delete(obj: IWallet) {
        Swal.fire({
            title: "Voulez-vous confirmer la suppression?",
            icon: "question",
            showDenyButton: true,
            confirmButtonText: "Oui",
            denyButtonText: `Non`
        }).then((result) => {
          if (result.isConfirmed) {
            if (obj._id)  this.wallet_store.delete(obj._id)
          } else if (result.isDenied) {

          }
        });
    }

}
