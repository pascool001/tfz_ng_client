import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ICountry } from '@models/country';
import { CountryStore } from '@stores/country_store';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { WalletStore } from '@stores/wallet_store';

@Component({
  selector: 'app-country-select',
  standalone: true,
  imports: [
        CommonModule,
        MatButtonModule,
        MatSelectModule,
        MatMenuModule,
        CdkMenuTrigger,
        CdkMenu,
        CdkMenuItem
  ],
  template: `
    <div class="w-3/4 flex flex-row justify-start ml-6 px-3">
      <div class="w-1/12 flex flex-row justify-start items-center">
          <button [cdkMenuTriggerFor]="menu" class="bg-transparent rounded  ">
              <img class="w-10 h-10 rounded-full" src={{selectedCountry?.country_flag}}  alt="flag">
          </button>
          <ng-template #menu>
            <div class="inline-flex flex-col bg-slate-200 mt-3 px-2 py-2 max-h-72 overflow-x-hidden overflow-y-auto" cdkMenu>
              @for (country of countries; track $index) {
                <button class="example-menu-item" cdkMenuItem (click)="selectOne(country)" class="w-56 flex flex-row justify-start hover:bg-slate-300">
                      <div class="w-48 flex flex-row justify-start items-center ">
                          <div class="w-1/4">
                            <img src={{country.country_flag}} class="rounded-full w-5 h-5 border-2 border-slate-400" width="70" height="70" alt="flag">
                          </div>
                          <div class="w-3/4 h-full flex flex-col pt-4 justify-start  ">
                            <h3> {{country.country_name}} </h3>
                          </div>
                      </div>
                </button>
              }
            </div>
          </ng-template>
      </div>
      <div class="w-4/12 flex flex-row justify-center items-center pt-3">
        <h1 class="text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-2xl  dark:text-white">
          {{title}}
        </h1>
      </div>
    </div>
  `,
})
export class CountrySelectComponent {

  selectedCountry: ICountry | undefined;

  country_store = inject(CountryStore)

  countries: ICountry[] = []

  title: string = ""

  constructor(public dialog: MatDialog) {
    effect( () => {
      this.countries = this.country_store.filteredCountry()
      this.selectedCountry = this.country_store.selectedCountry();
      this.title = (this.selectedCountry && this.selectedCountry?.country_name) ?? ""
    })
  }

  async ngOnInit() {
    await this.country_store.getAll()
  }


  selectOne(country:ICountry){
    if (country._id) {
      this.country_store.selectOne(country._id)
    }
  }



}
