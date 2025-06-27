import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CountryStore } from '@stores/country_store';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styles: ``
})
export class ConfirmDialogComponent {

  countryStore = inject(CountryStore)

  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  data = inject<any>(MAT_DIALOG_DATA);

  constructor(){}

  onNoClick(): void {
    this.dialogRef.close({confirmed: false, item:""});
  }

  async confirmer(){
    this.dialogRef.close({confirmed: true, item:this.data});
  }

}
