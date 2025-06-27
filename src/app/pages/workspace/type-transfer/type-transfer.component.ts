import { Dialog } from '@angular/cdk/dialog';
import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ITransferType } from '@models/transferType';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEllipsisVertical, heroMagnifyingGlass, heroPencilSquare, heroPlus, heroXCircle } from '@ng-icons/heroicons/outline';
import { TransferTypeStore } from '@stores/transferType_store';
import { TTypeFormDlgComponent } from './ttype-form-dlg.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-type-transfer',
  standalone: true,
  imports: [NgIcon, CommonModule, FormsModule],
  viewProviders: [provideIcons({ heroEllipsisVertical, heroPlus, heroMagnifyingGlass ,heroPencilSquare, heroXCircle })],
  templateUrl: './type-transfer.component.html',
  styleUrl: './type-transfer.component.css'
})
export class TypeTransferComponent {

    private dialog = inject(Dialog);

    transTypeData: ITransferType = {_id: '', designation: '', }

    transType_store = inject(TransferTypeStore)

    transfertTypes:ITransferType[] = []

    headers: (string|undefined)[] = [ "Désignation", "Actions" ]

    showSpinner: boolean = false;

    searchText: string=""

    title = "Transtypes list"

    router = inject(Router)

    constructor() {
      effect(() => {
        this.transfertTypes = this.transType_store.filtered()
        this.showSpinner = this.transType_store.loading()
      })
    }

    ngOnInit(): void {
      this.transType_store.getAll()
    }

    update(obj:ITransferType) {
      this.dialog.open(TTypeFormDlgComponent, {data: obj}).closed.subscribe(async result => {
        const data = result as ITransferType;
        if (data && data?._id) {
          await this.transType_store.update(data, data._id)
        }
      });
    }

    add(){
      this.dialog.open(TTypeFormDlgComponent).closed.subscribe((result) => {
        if (result) this.transType_store.add(result as ITransferType)
      });
    }

    handleQuery(){
      this.transType_store.updateQuery(this.searchText)
    }

    delete(obj: ITransferType) {
        Swal.fire({
            title: "Voulez-vous confirmer la suppression?",
            icon: "question",
            showDenyButton: true,
            confirmButtonText: "Oui",
            denyButtonText: `Non`
        }).then(async (result) => {
          if (result.isConfirmed) {
            if (obj._id)  await this.transType_store.delete(obj._id)
          } else if (result.isDenied) {

          }
        });
    }

}
