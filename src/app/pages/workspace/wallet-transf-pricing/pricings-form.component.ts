import { Component,effect,inject, Input, input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {TextFieldModule} from '@angular/cdk/text-field';
import { IWalletTP } from '@models/walletTransPricing';
import { ICombination } from '@models/wallet';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroXCircle } from '@ng-icons/heroicons/outline';
import { WalletStore } from '@stores/wallet_store';
import { WalletTPStore } from '@stores/walletTP_store';


@Component({
  selector: 'app-pricings-form',
  standalone: true,
  imports: [CommonModule, NgIcon, ReactiveFormsModule, TextFieldModule, MatFormFieldModule],
  viewProviders: [provideIcons({ heroPlus, heroXCircle})],
  template: `
    <form [formGroup]="pricingForm" class="w-full">
      <!-- ------------------------ -->
        <div class="w-full border-b-2 flex flex-row justify-center  h-14">
            <div class="w-9/12 flex flex-row justify-center items-center content-center">
              @if(wallet_couple()?.w_source?.wallet_name) {
                <p class="text-start text-lg ">
                  Tarification des transferts de <b> {{wallet_couple()?.w_source?.wallet_name}} </b> vers <b> {{wallet_couple()?.w_target?.wallet_name}} </b>
                </p>
              }
            </div>
            <div class="w-3/12  flex flex-row justify-evenly items-center content-center">
              <button type="button" (click)="postPricings()" [disabled]="!pricingForm.valid" class=" w-10 h-10 text-white disabled:bg-slate-500 bg-lime-700 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <ng-icon name="heroCheck" class="text-xl"  />
              </button>
              <button type="button" (click)="addPricing()" class=" w-10 h-10 text-white bg-blue-950 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <ng-icon name="heroPlus" class="text-xl"  />
              </button>
            </div>
        </div>

      <!-- --------------------- -->
      <div formArrayName="pricings" class="relative  max-h-96 overflow-y-auto overflow-x-hidden">
        <table>
          <tbody>
            @for (p of pricings.controls; track p; let i = $index) {
              <!-- *ngFor="let p of pricings.controls; let i = index" -->
                <tr  [formGroupName]="i" class="flex flex-row gap-x-3 items-center content-center w-full p-2 bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <td class="w-3/12">
                      <label for="mode" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">taxe mode</label>
                      <select name="mode" id="mode" formControlName="tp_tax_mode" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="PCTG">Pctage</option>
                        <option value="MTFIX">Mt. fixe</option>
                      </select>
                    </td>
                    <td class="w-2/12">
                        <label for="tp_mtmin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mt.min</label>
                        <input type="text" id="tp_mtmin" formControlName="tp_mtmin" placeholder="montant min." class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </td>
                    <td class="w-2/12">
                        <label for="tp_mtmax" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mt. max</label>
                        <input type="text" id="tp_mtmax" formControlName="tp_mtmax" placeholder="montant min." class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </td>
                    <td class="w-2/12">
                        <label for="tp_value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">value</label>
                        <input type="text" id="tp_value" formControlName="tp_value" placeholder="montant min." class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </td>
                    <td class="w-2/12 flex flex-row justify-center content-center h-full border-2 border-red-600">
                      <a type="button" (click)="removePrice(i)"  class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                        <ng-icon name="heroXCircle" class="text-2xl text-red-600"  />
                      </a>
                    </td>
                </tr>
            }
          </tbody>
        </table>

      </div>

    </form>
  `,
  styles: ``
})
export class PricingsFormComponent {

  wallet_couple = input<ICombination>()

  walletTP_Store = inject(WalletTPStore)

  wallet_store = inject(WalletStore)

  combinatedList : ICombination[] = []

  data = input<IWalletTP>()

  fb = inject(FormBuilder)

  pricingForm: FormGroup = new FormGroup({})

  constructor() {
    effect(() => {
      this.combinatedList = this.wallet_store.walletCombinatedByCountry()
      this.initPricingForm()
      // console.log("Form value : ", this.pricingForm.value)
      // console.log(" le Data : ", this.data())
    })
  }

  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
    this.pricingForm = this.fb.group({
        _id: [""],
        source_wallet: ["", Validators.required],
        target_wallet: ["", Validators.required],
        pricings: this.fb.array([])
    })
  }

  get formValid(): boolean {
    return this.pricingForm.valid
  }

  get transDirectionIds(): {source_wallet: string|undefined; target_wallet: string|undefined} {
    return {
      source_wallet : this.wallet_couple()?.w_source._id ,
      target_wallet : this.wallet_couple()?.w_target._id
    }
  }

  get tranferDirectionSelected(): boolean {
    if (this.wallet_couple()?.w_source._id && this.wallet_couple()?.w_target._id) {
      return true
    }
    return false;
  }

  initPricingForm() {
    this.buildForm()
    if (this.data()) {
      this.pricingForm.setValue({
        _id: this.data()?._id,
        source_wallet: this.data()?.wallet_source_id,
        target_wallet: this.data()?.wallet_target_id,
        pricings: this.data()?.pricings
      })
    } else if (this.tranferDirectionSelected) {
      this.pricingForm.setValue({
        _id: "",
        source_wallet: this.transDirectionIds.source_wallet ,
        target_wallet: this.transDirectionIds.target_wallet ,
        pricings: []
      })
    }
  }

  get pricings(): FormArray {
    return this.pricingForm.get('pricings') as FormArray;
  }


  addPricing() {
    const priceGroup = this.fb.group({
      tp_tax_mode: ["", Validators.required],
      tp_mtmin: ["", Validators.required],
      tp_mtmax: ["", Validators.required],
      tp_value: ["", Validators.required],
    })
    this.pricings.push(priceGroup)
  }

  removePrice(index: number) {
    this.pricings.removeAt(index);
  }

  async postPricings() {
    if (this.data()) {
      const id = this.data()?._id
      console.log('_id : ', id)
      if (id) this.walletTP_Store.update(this.pricingForm.value, id)
       if (this.wallet_couple()) {
        this.walletTP_Store.setCombination(this.wallet_couple())
      }
    } else {
      const  {_id, ...rest} = (this.pricingForm.value as IWalletTP)
      console.log('Saving : ', rest)
      await this.walletTP_Store.add(rest)
      if (this.wallet_couple()) {
        this.walletTP_Store.setCombination(this.wallet_couple())
      }
    }
  }



}
