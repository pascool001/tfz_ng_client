import { Component,inject, input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {TextFieldModule} from '@angular/cdk/text-field';
import { IWalletTP } from '@models/walletTransPricing';
import { ICombination } from '@models/wallet';


@Component({
  selector: 'app-pricings-form',
  standalone: true,
  imports: [ReactiveFormsModule, TextFieldModule],
  template: `
    <form [formGroup]="pricingForm" class="w-full">
      <div formArrayName="pricings" class="border-2">

      </div>

      pricings-form works!
    </form>
  `,
  styles: ``
})
export class PricingsFormComponent implements OnChanges {
  // @Input() wallet_couple: ICombination = {} as ICombination
  wallet_couple = input<ICombination|undefined>()
  // @Input() data: IWalletTP = {} as IWalletTP
  data = input<IWalletTP>()

  fb = inject(FormBuilder)

  pricingForm: FormGroup = new FormGroup({})

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
          console.log('Data input changed from:', changes['data'].previousValue, 'to:', changes['data'].currentValue);
          // Perform other actions based on the input change
        }
  }


  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
    this.pricingForm = this.fb.group({
        source_wallet: ["", Validators.required],
        target_wallet: ["", Validators.required],
        pricings: this.fb.array([])
    })
  }

  get hasTranferDirection(): boolean {
    if (this.wallet_couple()?.w_source._id && this.wallet_couple()?.w_target._id) {
      return true
    }
    return false;
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

  removeTask(index: number) {
    this.pricings.removeAt(index);
  }



}
