import { Component, effect, inject } from '@angular/core';
import { WalletSourceComponent } from './wallet-source.component';
import { WalletStore } from '@stores/wallet_store';
import { CountryStore } from '@stores/country_store';
import { WalletCibleComponent } from './wallet-cible.component';
import { IWallet } from '@models/wallet';
import { TransferPricingStore } from '@stores/transfertPricing_store';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroPlus, heroXCircle } from '@ng-icons/heroicons/outline';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPricingRange } from '@models/transPricing';
import Swal from 'sweetalert2'
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-transfer-pricing',
  standalone: true,
  imports: [WalletSourceComponent, WalletCibleComponent, NgIcon, MatSidenavModule, ReactiveFormsModule, MatExpansionModule],
  viewProviders: [provideIcons({ heroPlus, heroPencilSquare, heroXCircle})],
  templateUrl: './transfer-pricing.component.html',
  styles: ``
})
export class TransferPricingComponent {
    wallet_store = inject(WalletStore)
    country_Store = inject(CountryStore)
    Transfer_Pricing_Store = inject(TransferPricingStore)
    source_wallet: IWallet|undefined = undefined;
    target_wallet: IWallet|undefined = undefined;
    pricingForm: FormGroup = new FormGroup({})
    fb = inject(FormBuilder)
    isEdit: boolean = false

    pricingRanges: IPricingRange[] = []

    headers: (string|undefined)[] = [ "mode taxation", "Montant min.", "Montant max.", "Valeur", "---Actions---" ]

    constructor(){
        effect(() => {
          this.pricingRanges = this.Transfer_Pricing_Store.pricingList()
          console.log("this.pricingRanges : ", this.pricingRanges)
          console.log("directionsIds : ", this.Transfer_Pricing_Store.transDirectionIds())
        })
    }


    ngOnInit(): void {
      this.country_Store.getAll()
      this.wallet_store.getAll()
      this.Transfer_Pricing_Store.getAll()
      this.buildForm()
    }

    OnSourceSelect(sw: IWallet) {
      this.source_wallet = sw;
      const sourceId = sw._id ? sw._id : ""
      this.Transfer_Pricing_Store.setTranferSourceId(sourceId)
    }

    OnTargetSelect(tw:IWallet) {
      this.target_wallet = tw
      const targetId = tw._id ? tw._id : ""
      console.log("targetId: ", targetId)
      this.Transfer_Pricing_Store.setTranferTargetId(targetId)
    }

    newPricing() {
      this.isEdit = false
      this.pricingForm.setValue({
        _id:"",
        source_wallet: this.source_wallet?._id,
        target_wallet: this.target_wallet?._id,
        tp_tax_mode: "",
        tp_mtmin: "",
        tp_mtmax: "",
        tp_value: ""
      })
    }

    valider(){
      if(this.isEdit) {
        console.log("Formvalue edit : ", this.pricingForm.value)
        const {_id} = this.pricingForm.value
        this.Transfer_Pricing_Store.update(this.pricingForm.value, _id)
      } else {
        console.log("Formvalue new : ", this.pricingForm.value)
        const {_id, ...value} = this.pricingForm.value
        this.Transfer_Pricing_Store.add(value)
      }
    }

    buildForm() {
      this.pricingForm = this.fb.group({
          _id: [""],
          source_wallet: ["", Validators.required],
          target_wallet: ["", Validators.required],
          tp_tax_mode: ["", Validators.required],
          tp_mtmin: ["", Validators.required],
          tp_mtmax: ["", Validators.required],
          tp_value: ["", Validators.required]
      })
    }

    UpdatePricing(data: IPricingRange) {
      this.isEdit = true
      this.pricingForm.setValue(data)
      // if (data._id) {
      //   this.Transfer_Pricing_Store.update(data, data._id)
      // }
    }

    deletePricing(data: IPricingRange) {
        Swal.fire({
              title: "Voulez-vous confirmer la suppression?",
              icon: "question",
              showDenyButton: true,
              confirmButtonText: "Oui",
              denyButtonText: `Non`
        }).then((result) => {
            if (result.isConfirmed) {
                this.Transfer_Pricing_Store.delete(data._id || "")
            } else if (result.isDenied) {

            }
        });
    }

}
