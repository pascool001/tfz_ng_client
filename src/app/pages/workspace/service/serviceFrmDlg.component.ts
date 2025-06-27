import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { IService } from "@models/service";

@Component({
  selector: 'country-frm-dlg',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule],
  viewProviders: [],
  template: `
    <div class="p-6 bg-white rounded shadow">
      <h2 class="text-lg font-bold mb-4">
        {{ isEdit ? '✏️ Modifier' : '➕ Ajouter' }} un pays
      </h2>
      <form [formGroup]="ServiceForm" (ngSubmit)="submit()" class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">

          <div class="w-full">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom service</label>
            <input formControlName="name" type="text" name="name" id="name"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >

          </div>
          <div class="w-full">
            <label for="desc" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <input formControlName="desc" type="text"  name="desc" id="desc" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
          </div>
          <div class="grid gap-4 my-4 sm:grid-cols-2">
            <div>
              <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code service</label>
              <input formControlName="code"  type="text" name="code" id="code"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
            </div>
            <div class="flex items-center justify-center pt-5">
              <mat-checkbox class="example-margin" color="primary" formControlName="toSuscribe" >A Souscrire ?</mat-checkbox>
            </div>
          </div>
          @if (ServiceForm.get('toSuscribe')?.value == true) {
              <div formGroupName="pricing" class="w-full flex flex-row  gap-2 my-4 sm:grid-cols-3 ">
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
export class ServiceFrmDlgComponent implements OnInit {
  dialogRef = inject(DialogRef<IService | Omit<IService, '_id'>>);
  data = inject(DIALOG_DATA, { optional: true }) as IService | null;
  ServiceForm: FormGroup = new FormGroup({})
  ServicePricingForm: FormGroup = new FormGroup({})
  fb = inject(FormBuilder)

  isEdit = !!this.data; // si data != null

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.ServiceForm = this.fb.group({
      code: [this.data?.code || ""],
      name: [this.data?.name || ""],
      desc: [this.data?.desc || ""],
      toSuscribe: [this.data?.toSuscribe || false],
      pricing: this.fb.group({
        periodicite: [this.data?.pricing?.periodicite || ""],
        cout: [this.data?.pricing?.cout || ""],
        devise: [this.data?.pricing?.devise || ""]
      })
    });
  }


  submit() {
    const formData = (this.ServiceForm.value as IService)
    const {toSuscribe, pricing } = formData;
    if (this.isEdit) {
      this.dialogRef.close({ ...this.data, ...formData, pricing: toSuscribe? pricing : null });
    } else {
      this.dialogRef.close({ ...formData, pricing: toSuscribe? pricing : null });
    }
  }

  abandon() {
    this.dialogRef.close()
  }
}
