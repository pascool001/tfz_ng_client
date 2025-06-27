import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { ICountry } from '@models/country';

@Component({
  selector: 'app-tab-row-actions',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './tab-row-actions.component.html',
  styles: ``
})
export class TabRowActionsComponent {
  @Input({ required: true }) pays!: ICountry;
  @Output() updateData = new EventEmitter<ICountry>();
  @Output() removeData = new EventEmitter<string|undefined>();

  updateItem(value: ICountry) {
    this.updateData.emit(value);
  }

  deleteItem(id?: string) {
    this.removeData.emit(id)
  }
}
