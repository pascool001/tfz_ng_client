import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ProfilStore } from '@stores/profil_store';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEllipsisVertical, heroPlus, heroMagnifyingGlass, heroPencilSquare, heroXCircle  } from '@ng-icons/heroicons/outline';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { IProfil } from '@models/profil';
import { Router } from '@angular/router';
import { ProfileFormDlgComponent } from './profile-form-dialog.component';
import { Dialog } from '@angular/cdk/dialog';


@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      NgIcon,
      MatIconModule,
      ],
  viewProviders: [provideIcons({ heroEllipsisVertical, heroPlus, heroMagnifyingGlass ,heroPencilSquare, heroXCircle })],
  templateUrl: './profil.component.html',
})
export class ProfilComponent {
    dialog = inject(Dialog)
    profilData: IProfil = {code_profil: "", desi_profil: "", desc_profil: ""};

    profil_store = inject(ProfilStore)

    profils:IProfil[] = []

    headers: (string|undefined)[] = ["code profil", "designation", "description", "Actions" ]

    showSpinner: boolean = false;

    searchText: string=""

    title = "User profiles"

    router = inject(Router)

     constructor() {
      effect(() => {
        this.profils = this.profil_store.filteredProfils()
        this.showSpinner = this.profil_store.loading()
      })
    }

     ngOnInit(): void {
      this.profil_store.getAll()
    }

    update(obj:IProfil) {
      this.dialog.open(ProfileFormDlgComponent, {data: obj}).closed.subscribe(result => {
       const data = result as IProfil
       if (data && data?._id) {
          this.profil_store.updateProfil(data, data._id)
        }
      });
    }
    handleQuery(){
      this.profil_store.updateQuery(this.searchText)
    }
}
