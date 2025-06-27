import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ITransferType } from '@models/transferType';

@Component({
  selector: 'app-ttype-form-dlg',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
        <div class="p-6 bg-white rounded shadow">
      <h2 class="text-lg font-bold mb-4">
        {{ isEdit ? '✏️ Modifier' : '➕ Ajouter' }} un type de transfert
      </h2>
      <form [formGroup]="transTypeForm" (ngSubmit)="submit()" class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <div class="w-full">
            <label for="designation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Désignation</label>
            <input formControlName="designation"  type="text" name="designation" id="designation"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
        </div>


        <div class="flex items-center space-x-4 mt-4">
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
export class TTypeFormDlgComponent {

    dialogRef = inject(DialogRef<ITransferType | Omit<ITransferType, '_id'>>);

    data = inject(DIALOG_DATA, { optional: true }) as ITransferType | null;

    transTypeForm: FormGroup = new FormGroup({})

    fb = inject(FormBuilder)

    isEdit = !!this.data; // si data != null

    ngOnInit(): void {
      this.buildForm()
    }

    buildForm() {
      this.transTypeForm = this.fb.group({
        designation: [this.data?.designation ?? ''],
      })
    }

    submit() {
      if (this.isEdit) {
        this.dialogRef.close({ ...this.data, ...this.transTypeForm.value });
      } else {
        this.dialogRef.close({ ...this.transTypeForm.value});
      }
    }

    abandon() {
      this.dialogRef.close()
    }
}
