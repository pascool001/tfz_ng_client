import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-mycomp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mycomp.component.html',
  styleUrl: './mycomp.component.css'
})
export class MycompComponent {
  dialogRef = inject(DialogRef<MycompComponent>);

  close() {
    this.dialogRef.close();
  }

}
