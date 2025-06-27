import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, output, Output } from '@angular/core';
import { ICombination } from '@models/wallet';
import { WalletTPStore } from '@stores/walletTP_store';

@Component({
  selector: 'app-transfer-direction',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="clickCouple()"
    class="w-full flex flex-row justify-start py-2 rounded hover:bg-slate-200 "
    [ngClass]="{'border-b-2 border-l-2 border-b-yellow-400 border-l-yellow-400 bg-slate-200': isActive}"
    >
        <div class="w-full flex flex-row justify-evenly content-center items-center gap-5">
            <div >
              <img
                src="data:image/{{couple.w_source.wallet_logo_filename.split('.')[1]}};base64,{{couple.w_source.wallet_logo}}"
                class="rounded-full w-10 h-10"  alt="logo1"
              >
            </div>
            <div class="items-center justify-center pt-1/2" >
              @if(!isActive) {
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
  `,
  styles: ``
})
export class TransferDirectionComponent {
  @Input() couple: ICombination|any
  // couple = Input<ICombination|any>({} as ICombination )
  // user = input<User>({} as User);
  OnclickCouple = output<ICombination>();
  walletTP_store = inject(WalletTPStore)
  isActive: boolean =true;
  selected_id: string = ""
  constructor() {
    effect(() => {
      this.isActive = this.selected_id == this.walletTP_store.activeCombinationId()
    })
  }

  clickCouple() {
    const sourceId = (this.couple as ICombination).w_source._id
    const targetId = (this.couple as ICombination).w_target._id
    this.selected_id = (sourceId && targetId) ? sourceId.concat("-").concat(targetId) : ""
    // this.walletTP_store.setCombination(this.couple)
    this.OnclickCouple.emit(this.couple)
  }


}
