import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICountry } from '@models/country';
import { IService } from '@models/service';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIcon, provideIcons,  } from '@ng-icons/core';
import { heroPlus, heroPencilSquare  } from '@ng-icons/heroicons/outline';
import { ServiceStore } from '@stores/service_store';

@Component({
  selector: 'service-pricing',
  standalone: true,
  imports: [ ],
  viewProviders: [provideIcons({ heroPlus, heroPencilSquare  })],
  template: `

  `,
  styles: ``
})
export class ServicePricingComponent {

  @Input()
  set FormData(value: IService) {
    if (!Object.values(value).filter(item => item != "").length ) {
      // console.warn('Format de donnée incorrect');
    }
    this.serviceForm.setValue(value)
  }


  @Input() newData:boolean = true

  service_store = inject(ServiceStore)

  private modalService = inject(NgbModal)

   serviceForm: FormGroup = new FormGroup({})

  fb = inject(FormBuilder)

  constructor() {
    this.buildForm()
  }

  open(content: TemplateRef<any>) {
    if (this.newData) {
      this.serviceForm.reset()
    }
		this.modalService.open(content, { centered: true, backdrop: false })

	}

  buildForm() {
    this.serviceForm = this.fb.group({
      _id: [''],
      code: [''],
      name: [''],
      desc: [''],
      toSuscribe: [true],
      pricing: this.fb.group({
        periodicite: [""],
        cout: [""],
        devise: [""]
      })
    })
  }

  valider() {
    if (this.newData) {
      const { _id, ...data } = this.serviceForm.value
      this.service_store.add({...data})

    } else {
      const { _id, ...data } = this.serviceForm.value
      this.service_store.update(data, _id)
    }
  }


}
