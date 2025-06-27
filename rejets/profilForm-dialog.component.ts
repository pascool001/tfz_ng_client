import { Component, inject, Input, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProfil } from '@models/profil';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIcon, provideIcons,  } from '@ng-icons/core';
import { heroPlus, heroPencilSquare  } from '@ng-icons/heroicons/outline';

import { ProfilStore } from '@stores/profil_store';

@Component({
  selector: 'profile-form-dialog',
  standalone: true,
  imports: [ NgbDatepickerModule, NgIcon, ReactiveFormsModule ],
  viewProviders: [provideIcons({ heroPlus, heroPencilSquare  })],
  template: `

      <ng-template #profileContent let-modal>
        <div class="modal-header">
          <h4 class="modal-title" id="modal-basic-title">User profil</h4>
          <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss()"></button>
        </div>
        <div class="modal-body">
          <div class="relative w-full max-w-2xl max-h-full">
                <!-- Formulaire -->
                <form [formGroup]="profilForm" (submit)="valider(); modal.close('submited') " class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  <div class="w-full">
                      <label for="code_profil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code profil</label>
                      <input formControlName="code_profil"  type="text" name="code_profil" id="code_profil"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                  </div>
                  <div class="grid gap-4 my-4 sm:grid-cols-2">
                      <div>
                          <label for="desi_profil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Designation</label>
                          <input formControlName="desi_profil" type="text" name="desi_profil" id="desi_profil"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                      </div>
                      <div>
                          <label for="desc_profil" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                          <input formControlName="desc_profil" type="text"  name="desc_profil" id="desc_profil" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                      </div>
                    </div>

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
        <button type="button" (click)="open(profileContent)" class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <ng-icon name="heroPlus" class="text-2xl"  />
        </button>
      } @else {
        <a type="button" (click)="open(profileContent)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
          <ng-icon name="heroPencilSquare" class="text-2xl"  />
        </a>
      }
  `,
  styles: ``
})
export class ProfilFormDialogComponent {

  @Input()
  set FormData(value: IProfil) {
    if (!Object.values(value).filter(item => item != "").length ) {
      // console.warn('Format de donnée incorrect');
    }
    this.profilForm.setValue(value)
  }


  @Input() newData:boolean = true

  profil_store = inject(ProfilStore)

  private modalService = inject(NgbModal)

   profilForm: FormGroup = new FormGroup({})

  fb = inject(FormBuilder)

  constructor() {
    this.buildForm()
  }

  open(content: TemplateRef<any>) {
    if (this.newData) {
      this.profilForm.reset()
    }
		this.modalService.open(content, { centered: true, backdrop: false })

	}

  buildForm() {
    this.profilForm = this.fb.group({
      _id: [''],
      code_profil: [{value: null, disabled: true}],
      desi_profil: [''],
      desc_profil: ['']
    })
  }

  valider() {
    if (this.newData) {
      const { _id, ...data } = this.profilForm.value
      this.profil_store.addProfil({...data})

    } else {
      const { _id, ...data } = this.profilForm.value
      this.profil_store.updateProfil(data, _id)
      console.log("saved updated data: ", this.profilForm.value)
    }
  }


}
