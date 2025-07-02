import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { ICombination } from '@models/wallet';
import { WalletTPStore } from '@stores/walletTP_store';

@Component({
  selector: 'app-transfer-directions',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for(couple of combinatedList(); track couple; let index = $index) {
        <button (click)="couple.isActive = true; clickCouple(couple, index); "
          class="w-full flex flex-row justify-start py-2 rounded hover:bg-slate-200 "
          [ngClass]="{'border-b-2 border-l-2 border-b-yellow-400 border-l-yellow-400 bg-slate-200': couple.isActive}"
          >
              <div class="w-full flex flex-row justify-evenly content-center items-center gap-5">
                  <div >
                    <img
                      src="data:image/{{couple.w_source.wallet_logo_filename.split('.')[1]}};base64,{{couple.w_source.wallet_logo}}"
                      class="rounded-full w-10 h-10"  alt="logo1"
                    >
                  </div>
                  <div class="items-center justify-center pt-1/2">
                    @if(!couple.isActive ) {
                      <img src="assets/icons/arrow1.png" class="w-10 h-10 hover: text-gray-50" alt="direction"/>
                    } @else {
                      <img src="assets/icons/arrow2.png" class="w-10 h-10 hover: text-gray-50" alt="direction"/>
                    }
                  </div>
                  <div>
                    <img
                      src="data:image/{{couple.w_target.wallet_logo_filename.split('.')[1]}};base64,{{couple.w_target.wallet_logo}}"
                      class="rounded-full w-10 h-10"  alt="logo2"
                    >
                  </div>
              </div>
          </button>
    }
  `,
  styles: ``
})
export class TransferDirectionsComponent {
  combinatedList = input<ICombination[]>()
  walletTP_store = inject(WalletTPStore)
  OnclickCouple = output<ICombination>();

  constructor() {
    effect(() => {
      if (!!this.combinatedList()?.length) {
        let firstItem = this.combinatedList()?.at(0)
        if (firstItem) this.clickCouple(firstItem, 0)
      }
    })
  }

  clickCouple(couple: ICombination, index:number) {
    this.combinatedList()?.forEach((element, i) => {
      element.isActive = (index === i) ? true : false
    });
    this.OnclickCouple.emit(couple)
  }

}
