import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ICountry } from "@models/country";

@Component({
  selector: 'country-frm-dlg',
  standalone: true,
  imports: [ReactiveFormsModule],
  viewProviders: [],
  template: `
    <div class="p-6 bg-white rounded shadow">
      <h2 class="text-lg font-bold mb-4">
        {{ isEdit ? '✏️ Modifier' : '➕ Ajouter' }} un pays
      </h2>
      <form [formGroup]="CountryForm" (ngSubmit)="submit()" class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
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
                {{ isEdit ? 'Mise à jour' : 'Création' }}
            </button>
            <button type="button" (click)="abandon()" class="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                Abandon
            </button>
        </div>
      </form>
    </div>
  `,
  styles: ``
})
export class CountryFormDlgComponent implements OnInit {

  dialogRef = inject(DialogRef<ICountry | Omit<ICountry, '_id'>>);

  data = inject(DIALOG_DATA, { optional: true }) as ICountry | null;

  CountryForm: FormGroup = new FormGroup({})

  fb = inject(FormBuilder)

  isEdit = !!this.data; // si data != null

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.CountryForm = this.fb.group({
      country_name: [this.data?.country_name ?? ''],
      country_indic: [this.data?.country_indic ?? ''],
      country_code: [this.data?.country_code ?? ''],
      country_flag: [this.data?.country_flag ?? ''],
    })
  }

  submit() {
    if (this.isEdit) {
      this.dialogRef.close({ ...this.data, ...this.CountryForm.value, country_flag: `https://flagsapi.com/${this.CountryForm.value?.country_code}/flat/64.png` });
    } else {
      this.dialogRef.close({ ...this.CountryForm.value, country_flag: `https://flagsapi.com/${this.CountryForm.value?.country_code}/flat/64.png` });
    }
  }

  abandon() {
    this.dialogRef.close()
  }
}
