import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroFlag, heroUserGroup, heroBanknotes, heroArrowPathRoundedSquare, heroSparkles, heroForward, heroClipboardDocumentCheck } from '@ng-icons/heroicons/outline';
import { UIStore } from '@stores/ui_store';



@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, NgIcon],
  viewProviders: [provideIcons({  heroFlag, heroUserGroup, heroBanknotes, heroArrowPathRoundedSquare, heroSparkles, heroForward,heroClipboardDocumentCheck })],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  dialog = inject(MatDialog)
  // ----------------------------
  compName: string = '';
  active:boolean = true;
  color: string = 'red-700';
  router = inject(Router)
  href: string ="";
  currentUrl: string = ""

  uistore = inject(UIStore)

  constructor() {
    effect(() => {
      this.compName = this.uistore.urlEndsWith()
    })
  }

  ngOnInit(): void {
    this.uistore.setUrl(this.router.url)
     this.router.events.subscribe(event => {
         if (event instanceof NavigationEnd) {
          this.uistore.setUrl(event.url)
         }
       });
  }

  routeToComp(name: String) {
    switch (name) {
      case 'country': this.router.navigate(["/workspace/settings/country"]); break;
      case 'profil':  this.router.navigate(["/workspace/settings/profil"]); break;
      case 'service':  this.router.navigate(["/workspace/settings/service"]); break;
      case 'transfer-type':  this.router.navigate(["/workspace/settings/transfer-type"]); break;
      case 'wallet':  this.router.navigate(["/workspace/settings/wallet"]); break;
      case 'wallet-pricing':  this.router.navigate(["/workspace/settings/wallet-pricing"]); break;
      default:
        break;
    }
  }


}


