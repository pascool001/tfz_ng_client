import { Component, inject, Input } from '@angular/core';
import { IService, IServicePricing } from '@models/service';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { heroEllipsisHorizontalCircle } from '@ng-icons/heroicons/outline';


heroEllipsisHorizontalCircle
@Component({
  selector: 'app-srv-pricing-popover',
  standalone: true,
  imports: [NgbPopoverModule, NgIcon],
  providers: [NgbPopoverConfig],
  viewProviders: [provideIcons({ heroEllipsisHorizontalCircle  })],
  template: `
    <ng-template #popContent class="bg-lime-200">
        Periodicite: <b> {{data?.pricing?.periodicite}} </b>
        Cout       : <b> {{data?.pricing?.cout}} </b>
        Desvise: <b> {{data?.pricing?.devise}} </b>
    </ng-template>
    <ng-template #popTitle>
      Tarification service <b> {{data?.code}}  </b>
    </ng-template>

    <a type="button"  [ngbPopover]="popContent" [popoverTitle]="popTitle" popoverClass="my-custom-class"  class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
    <ng-icon name="heroEllipsisHorizontalCircle" class="text-2xl text-lime-600"  />
    </a>
  `,
  styles: ``
})
export class SrvPricingPopoverComponent {
  // @Input() PricingObject: IServicePricing | null = {periodicite: "", cout: 0, devise: "FCFA"}
  @Input() data: IService | null = null
  config= inject(NgbPopoverConfig)
  constructor() {
		this.config.placement = 'top';
		this.config.triggers = 'hover';
	}

}
