import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileApi } from '@backend/httpRequests/fileApi';
import { ICountry } from '@models/country';
import { IWallet } from '@models/wallet';
import { CountryStore } from '@stores/country_store';

interface NewFormData {
  data: IWallet;
  countryId: string;
}


@Component({
  selector: 'app-wallet-form-dlg',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  template: `
      <div class="p-6 bg-white rounded shadow">
      <h2 class="text-lg font-bold mb-4">
        {{ isEdit ? '✏️ Modifier' : '➕ Ajouter' }} un wallet
      </h2>
      <form [formGroup]="WalletForm" (ngSubmit)="submit()" class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <div class="w-full">
            <label for="wallet_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Désignation wallet</label>
            <input formControlName="wallet_name"  type="text" name="wallet_name" id="wallet_name"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
        </div>

        <div class="mb-5 mt-5 w-full bg-gray-100 rounded">
          <input
            class="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"
            type="file"
            id="formFile" (change)="onChange($event)"
          />
        </div>
        @if (imageUrl) {
            <div class="flex flex-row justify-center mb-4">
                <img class="rounded-md w-32 h-32 border-2 border-gray-400" src="{{imageUrl}}" alt="" >
            </div>
        }

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
export class WalletFormDlgComponent {

    dialogRef = inject(DialogRef<IWallet | Omit<IWallet, '_id'>>);

    data = inject(DIALOG_DATA, { optional: true }) as IWallet | null;

    WalletForm: FormGroup = new FormGroup({})

    fb = inject(FormBuilder)

    isEdit = !!this.data;

    imageFile?: File;

    imageUrl=""

    country_store = inject(CountryStore)

    fileApi = inject(FileApi)

    ngOnInit(): void {
      this.buildForm()
      if (this.data?.wallet_logo) {
        this.imageUrl = `data:image/${this.data.wallet_logo_filename?.split('.')[1]};base64, ${this.data.wallet_logo}`
      }
    }

    buildForm() {
      this.WalletForm = this.fb.group({
        wallet_name: [this.data?.wallet_name ?? ''],
        wallet_logo_filename: [this.data?.wallet_logo_filename ?? ''],
        wallet_logo: [this.data?.wallet_logo ?? ''],
      })
    }

    async submit() {
      const filename = await this.saveLogoAndReturnFilename()
      if (this.isEdit) {
        if (this.imageFile) {
          this.dialogRef.close({...this.data, ...this.WalletForm.value, wallet_logo_filename: filename });
        } else {
          this.dialogRef.close({...this.data, ...this.WalletForm.value });
        }
      } else {
        this.dialogRef.close({...this.WalletForm.value, wallet_logo_filename: (this.imageFile && filename) ? filename : null  });
      }

    }

    async saveLogoAndReturnFilename(): Promise<string|null> {
      if (this.imageFile) {
        const formData = new FormData()
        formData.append("file", this.imageFile, this.imageFile.name)
        try {
          const {data: {filename}} = await this.fileApi.uploadFile(formData)
          return filename
        } catch (error) {
          console.error("File upload error: ", error)
          return null
        }
      }
      return null
    }

    abandon() {
      this.dialogRef.close()
    }


  onChange(e: any) {
    if (e.target.files.length > 0) {
      this.imageFile = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload=(event: any) => {
        this.imageUrl = event.target.result
      }
    }
  }


}
