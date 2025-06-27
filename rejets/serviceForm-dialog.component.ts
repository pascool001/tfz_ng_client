import { Component, inject, Input, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule } from '@angular/forms';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { IService } from '@models/service';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIcon, provideIcons,  } from '@ng-icons/core';
import { heroPlus, heroPencilSquare  } from '@ng-icons/heroicons/outline';
import { ServiceStore } from '@stores/service_store';

@Component({
  selector: 'service-form-dialog',
  standalone: true,
  imports: [ NgbDatepickerModule, NgIcon, ReactiveFormsModule, MatCheckboxModule ],
  viewProviders: [provideIcons({ heroPlus, heroPencilSquare  })],
  template: `
      <ng-template #content_service let-modal>
      <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">Service form</h4>
        <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <div class="relative w-full max-w-3xl max-h-full">
              <!-- Formulaire -->
              <form [formGroup]="serviceForm" (submit)="valider(); modal.close('submited') " class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  <!-- ------------- -->
                  <input formControlName="_id"  type="text" name="_id" id="_id"  class="invisible" >
                  <div class="grid gap-4 my-4 sm:grid-cols-2">
                      <div>
                         <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code du service</label>
                        <input formControlName="code"  type="text" name="code" id="code"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                      </div>
                      <div class="flex items-center justify-center pt-4">
                        <mat-checkbox class="example-margin" formControlName="toSuscribe" >A Souscrire ?</mat-checkbox>
                      </div>
                  </div>
                  <!-- ----------- -->
                  <div class="grid gap-4 my-4 sm:grid-cols-2">
                      <div>
                          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">designation</label>
                          <input formControlName="name" type="text" name="name" id="name"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                      </div>
                      <div>
                          <label for="desc" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                          <input formControlName="desc" type="text"  name="desc" id="desc" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                      </div>
                  </div>
                  @if (serviceForm.get('toSuscribe')?.value == true) {
                    <div formGroupName="pricing" class="w-full flex flex-row  gap-2 my-4 sm:grid-cols-3 border-t-2 border-gray-600">
                      <div class="w-1/3">
                        <label class=" mb-1 text-sm font-medium text-gray-900 dark:text-white">Périodicite</label>
                        <input type="text" formControlName="periodicite" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      </div>
                      <div class="w-1/3">
                        <label class=" mb-1 text-sm font-medium text-gray-900 dark:text-white">Cout</label>
                        <input type="number" formControlName="cout" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      </div>
                      <div class="w-1/3">
                        <label class=" mb-1 text-sm font-medium text-gray-900 dark:text-white">Devise</label>
                        <input type="text" formControlName="devise" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      </div>
                    </div>
                  }

                  <div class="flex items-center space-x-4">
                      <button type="submit" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                          Submit
                      </button>
                      <button type="button" (click)="modal.close('aborted') " class="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                          Abandon
                      </button>
                  </div>
                </form>

          </div>

      </div>

      </ng-template>
      @if(newData) {
        <button type="button" (click)="open(content_service)" class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <ng-icon name="heroPlus" class="text-2xl"  />
        </button>
      } @else {
        <a type="button" (click)="open(content_service)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
          <ng-icon name="heroPencilSquare" class="text-2xl"  />
        </a>
      }
  `,
  styles: ``
})
export class ServiceFormDialogComponent {

  @Input()
  set FormData(value: IService) {


    this.serviceForm.setValue(value)
  }

  @Input() newData:boolean = true



  service_store = inject(ServiceStore)

  private modalService = inject(NgbModal)

   serviceForm: FormGroup = new FormGroup({})

  fb = inject(FormBuilder)

  constructor() {
    this.buildForm()
  }

  open(content: TemplateRef<any>) {
    if (this.newData) {
      this.serviceForm.reset()
    }
		this.modalService.open(content, { centered: true, backdrop: false })
	}

  buildForm() {
    this.serviceForm = this.fb.group({
      _id: [''],
      code: [''],
      name: [''],
      desc: [''],
      toSuscribe: [true],
      pricing: this.fb.group({
        periodicite: [""],
        cout: [""],
        devise: [""]
      })
    })
  }

  valider() {
    if (this.newData) {
      const { _id, ...data } = this.serviceForm.value
      this.service_store.add({...data})

    } else {
      const { _id, ...data } = this.serviceForm.value
      this.service_store.update(data, _id)
    }
  }


}
