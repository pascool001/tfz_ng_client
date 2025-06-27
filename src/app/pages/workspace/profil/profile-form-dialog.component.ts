import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IProfil } from "@models/profil";

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
      <form [formGroup]="ProfilForm" (ngSubmit)="submit()" class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
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
export class ProfileFormDlgComponent implements OnInit {
  dialogRef = inject(DialogRef<IProfil | Omit<IProfil, '_id'>>);
  data = inject(DIALOG_DATA, { optional: true }) as IProfil | null;
  ProfilForm: FormGroup = new FormGroup({})
  fb = inject(FormBuilder)

  isEdit = !!this.data; // si data != null

  ngOnInit(): void {
    this.buildForm()


  }

  buildForm() {
    this.ProfilForm = this.fb.group({
      code_profil: [{value: null, disabled: true}],
      desi_profil: [''],
      desc_profil: [''],
    });
     this.ProfilForm.setValue({
      code_profil: this.data?.code_profil ?? '',
      desi_profil: this.data?.desi_profil ?? '',
      desc_profil: this.data?.desc_profil ?? ''
    })
  }



  submit() {
    if (this.isEdit) {
      this.dialogRef.close({ ...this.data, ...this.ProfilForm.value });
    } else {
      this.dialogRef.close({ ...this.ProfilForm.value });
    }
  }

  abandon() {
    this.dialogRef.close()
  }
}
