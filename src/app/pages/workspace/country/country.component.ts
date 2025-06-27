import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ICountry } from '@models/country';
import { CountryStore } from '@stores/country_store';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEllipsisVertical, heroPlus, heroMagnifyingGlass, heroPencilSquare, heroXCircle  } from '@ng-icons/heroicons/outline';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2'
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { CountryFormDlgComponent } from './country-form-dialog.component';
import {ScrollingModule} from '@angular/cdk/scrolling';



@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIcon,
    MatIconModule,
    ScrollingModule
    ],
  viewProviders: [provideIcons({ heroEllipsisVertical, heroPlus, heroMagnifyingGlass ,heroPencilSquare, heroXCircle })],
  templateUrl: './country.component.html',
  styles: ` `,

})
export class CountryComponent implements OnInit {

  private dialog = inject(Dialog);

  countryData: ICountry = {_id: '', country_code: '', country_indic: '', country_name: '', country_flag: '' }

  country_store = inject(CountryStore)

  countries:ICountry[] = []

  headers: (string|undefined)[] = [ "-", "Indicatif", "Code", "Nom", "Actions" ]

  showSpinner: boolean = false;

  searchText: string=""

  title = "List of countries"

  router = inject(Router)



  constructor() {
    effect(() => {
      this.countries = this.country_store.filteredCountry()
      this.showSpinner = this.country_store.loading()
    })
  }

  ngOnInit(): void {
    this.country_store.getAll()
  }

  update(obj:ICountry) {
     this.dialog.open(CountryFormDlgComponent, {data: obj}).closed.subscribe(result => {
        const data = result as ICountry;
        console.log("data : ", data)
        if (data && data?._id) {
          this.country_store.updateCountry(data, data._id)
        }
      });
  }

  addCountry(){
    this.dialog.open(CountryFormDlgComponent).closed.subscribe((result) => {
      // console.log("result : ", result)
      if (result) this.country_store.addCountry(result as ICountry)
    });
  }

  handleQuery(){
    this.country_store.updateQuery(this.searchText)
  }

  deleteCountry(obj: ICountry) {
      Swal.fire({
          title: "Voulez-vous confirmer la suppression?",
          icon: "question",
          showDenyButton: true,
          confirmButtonText: "Oui",
          denyButtonText: `Non`
      }).then((result) => {
        if (result.isConfirmed) {
          if (obj._id)  this.country_store.deleteCountry(obj._id)
        } else if (result.isDenied) {

        }
      });
  }

}
