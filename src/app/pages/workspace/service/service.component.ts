import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IService } from '@models/service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ServiceStore } from '@stores/service_store';
import Swal from 'sweetalert2';
import { heroEllipsisVertical, heroMagnifyingGlass, heroPencilSquare, heroPlus, heroXCircle } from '@ng-icons/heroicons/outline';
import { Dialog } from '@angular/cdk/dialog';
import { ServiceFrmDlgComponent } from './serviceFrmDlg.component';
import { SrvPricingPopoverComponent } from './srv-pricing-popover.component';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      NgIcon,
      SrvPricingPopoverComponent
      ],
  viewProviders: [provideIcons({ heroEllipsisVertical, heroPlus, heroMagnifyingGlass ,heroPencilSquare, heroXCircle })],
  templateUrl: './service.component.html',
})
export class ServiceComponent {
    dialog = inject(Dialog)

    service_store = inject(ServiceStore)

    services:IService[] = []

    headers: (string|undefined)[] = ["Code", "Name", "Descriptions", "Souscription", "pricing", "Actions" ]

    showSpinner: boolean = false;

    searchText: string=""

    title = "Services"

    constructor() {
      effect(() => {
        this.services = this.service_store.filtered()
        this.showSpinner = this.service_store.loading()
      })
    }

    ngOnInit(): void {
      this.service_store.getAll()
    }

    handleQuery(){
      this.service_store.updateQuery(this.searchText)
    }


    addService(){
      this.dialog.open(ServiceFrmDlgComponent).closed.subscribe((result) => {
        if (result) this.service_store.add(result as IService)
      });
    }


    update(obj: IService){
      this.dialog.open(ServiceFrmDlgComponent, {data: obj}).closed.subscribe(result => {
        const data = result as IService
        if (data && data?._id) {
          this.service_store.update(data, data._id)
        }
      });
    }

    deleteCountry(obj: IService) {
        Swal.fire({
            title: "Voulez-vous confirmer la suppression?",
            icon: "question",
            showDenyButton: true,
            confirmButtonText: "Oui",
            denyButtonText: `Non`
        }).then((result) => {
          if (result.isConfirmed) {
            if (obj._id)  this.service_store.delete(obj._id)
          } else if (result.isDenied) {

          }
        });
    }

}
