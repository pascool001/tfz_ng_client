import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICountry } from '@models/country';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIcon, provideIcons,  } from '@ng-icons/core';
import { heroPlus, heroPencilSquare  } from '@ng-icons/heroicons/outline';
import { CountryStore } from '@stores/country_store';

@Component({
  selector: 'country-form-dialog',
  standalone: true,
  imports: [ NgbDatepickerModule, NgIcon, ReactiveFormsModule ],
  viewProviders: [provideIcons({ heroPlus, heroPencilSquare  })],
  template: `
      <ng-template #content let-modal>
      <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">Profile update</h4>
        <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <div class="relative w-full max-w-2xl max-h-full">
              <!-- Formulaire -->
              <form [formGroup]="countryForm" (submit)="valider(); modal.close('submited') " class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <div class="w-full">
                    <label for="country_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom pays</label>
                    <input formControlName="country_name"  type="text" name="country_name" id="country_name"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                </div>
                <div class="grid gap-4 my-4 sm:grid-cols-2">
                    <div>
                        <label for="country_indic" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Indicatif</label>
                        <input formControlName="country_indic" type="text" name="country_indic" id="country_indic"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                    </div>
                    <div>
                        <label for="country_code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code pays</label>
                        <input formControlName="country_code" type="text"  name="country_code" id="country_code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
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
        <button type="button" (click)="open(content)" class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <ng-icon name="heroPlus" class="text-2xl"  />
        </button>
      } @else {
        <a type="button" (click)="open(content)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
          <ng-icon name="heroPencilSquare" class="text-2xl"  />
        </a>
      }
  `,
  styles: ``
})
export class CountryFormDialogComponent {

  @Input()
  set FormData(value: ICountry) {
    if (!Object.values(value).filter(item => item != "").length ) {
      // console.warn('Format de donnée incorrect');
    }
    this.countryForm.setValue(value)
  }


  @Input() newData:boolean = true

  country_store = inject(CountryStore)

  private modalService = inject(NgbModal)

   countryForm: FormGroup = new FormGroup({})

  fb = inject(FormBuilder)

  constructor() {
    this.buildForm()
  }

  open(content: TemplateRef<any>) {
    if (this.newData) {
      this.countryForm.reset()
    }
		this.modalService.open(content, { centered: true, backdrop: false })
    // .result.then(
		// 	(result) => {
    //     console.log("result: ", result)
    //     // alert(result)
		// 		// this.closeResult.set(`Closed with: ${result}`);
		// 	},
		// 	(reason) => {
    //     console.log("close reason: : ", reason)
		// 		// this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
		// 	},
		// );
	}

  buildForm() {
    this.countryForm = this.fb.group({
      _id: [''],
      country_name: [''],
      country_indic: [''],
      country_code: [''],
      country_flag: ['']
    })
  }

  valider() {
    if (this.newData) {
      const { _id, ...data } = this.countryForm.value
      this.country_store.addCountry({...data, country_flag: `https://flagsapi.com/${data.country_code}/flat/64.png`})

    } else {
      const { _id, ...data } = this.countryForm.value
      this.country_store.updateCountry(data, _id)
      console.log("saved updated data: ", this.countryForm.value)
    }
  }


}
