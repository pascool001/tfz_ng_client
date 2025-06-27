import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@components/header/header.component';
import { GlobalNotify } from '@components/notity/notity.component';

@Component({
  selector: 'app-ws-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HeaderComponent, GlobalNotify],
  templateUrl: './ws-layout.component.html',
})
export class WsLayoutComponent {

}
