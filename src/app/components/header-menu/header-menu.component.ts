import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Dropdown,
  Ripple,
  initTWE,
} from "tw-elements";

interface Sousmenu {
  label: string;
  path?: string;
}

export interface Menu {
  main_menu: string;
  sous_menus: Sousmenu[];
}


@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header-menu.component.html',
  styles: ``
})
export class HeaderMenuComponent implements OnInit {


  @Input({ required: true }) menu_item!: Menu;


  ngOnInit(): void {
    initTWE({ Dropdown, Ripple });
  }

}
