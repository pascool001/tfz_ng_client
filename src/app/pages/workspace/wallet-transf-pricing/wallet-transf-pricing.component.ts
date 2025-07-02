import { Component, effect, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { ICombination } from '@models/wallet';
import { IWalletTP } from '@models/walletTransPricing';
import { CountryStore } from '@stores/country_store';
import { WalletStore } from '@stores/wallet_store';
import { WalletTPStore } from '@stores/walletTP_store';
import { CountrySelectComponent } from '../wallet/country-select.component';
import {MatListModule} from '@angular/material/list';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck, heroPlus } from '@ng-icons/heroicons/outline';
import { PricingsFormComponent } from './pricings-form.component';
import { TransferDirectionsComponent } from './transfer-directions.component';


@Component({
  selector: 'app-wallet-transf-pricing',
  standalone: true,
  imports: [
    CountrySelectComponent,
    TransferDirectionsComponent,
    PricingsFormComponent,
    MatListModule,
  ],
  viewProviders: [provideIcons({ heroPlus,heroCheck})],
  templateUrl: './wallet-transf-pricing.component.html',
  styles: ``
})
export class WalletTransfPricingComponent {
  @ViewChild(PricingsFormComponent) PricingsForm!: PricingsFormComponent;
  wallet_store = inject(WalletStore)
  walletTpStore = inject(WalletTPStore)
  country_store = inject(CountryStore)
  combinatedList : ICombination[] = []
  wallet_transfer_Pricing: IWalletTP | undefined = undefined
  title = "Gestion des tranches tarifaires / Transferts intra && inter-réseau"

  selectedCouple: ICombination | undefined = undefined
  PricingArr: IWalletTP[] = []
  constructor() {
    effect(() => {
      this.combinatedList = this.wallet_store.walletCombinatedByCountry()
      if (!this.combinatedList.length) {
        this.selectedCouple = undefined
      }
      this.PricingArr = this.walletTpStore.walletTPS()
      this.wallet_transfer_Pricing = this.walletTpStore.Wallet_Combination_Princing_Range()
      console.log('this.wallet_transfer_Pricing : ', this.wallet_transfer_Pricing )
      console.log('this.PricingArr : ', this.PricingArr )
    })
  }

  ngOnInit(): void {
    this.country_store.getAll()
    this.wallet_store.getAll()
  }

  onCoupleSelected(w_couple: ICombination) {
    this.walletTpStore.setCombination(w_couple)
    this.selectedCouple = w_couple;
  }

  // addPriceRange() {
  //   this.PricingsForm.addPricing()
  // }

}
