import { Component, inject } from '@angular/core';
import { Notifier } from '@utilities';
import Swal from 'sweetalert2'

// @Component({
//   selector: 'app-notity',
//   standalone: true,
//   imports: [],
//   template: ``,
//   styles: ``
// })
// export class NotityComponent implements OnChanges {
//   @Input() show: boolean = false;

//   @Input() success: boolean|null = null

//   message: string = ""

//   successOptions: {} = { icon: "success", title: "Opération réussie",   background: '#009432',
//             iconColor: '#ffffff',  color:'#ffffff', }
//   errorOptions: {} = { icon: "error", title: "Echec, l'opération à échouée",   background: '#eb2f06',
//             iconColor: '#ffffff',  color:'#ffffff', }


//   constructor() { }

//   ngOnChanges(changes: SimpleChanges) {
//     console.log("onChanges .....")
//     if (changes['show'] && changes['show'].currentValue === true) {
//       this.notifyMe();
//       setTimeout(() => {
//         this.show = false
//       }, 0);
//     }
//   }


//   notifyMe() {
//     const specific: {} = this.success ? {...this.successOptions} :  {...this.errorOptions}
//     Swal.fire({
//       position: "top",
//       showConfirmButton: false,
//       timer: 2000,
//       width: '400px',
//       heightAuto: true,
//       toast: true,
//       ...specific
//     });
//   }

// }

//` <app-notity [show]="shouldRun" [success]="success"></app-notity>`,
@Component({
  selector: 'app-globalNotity',
  standalone: true,
  imports: [],
  template: ``,
  styles: ``
})
export class GlobalNotify {
  notify = inject(Notifier)
  shouldRun: boolean = false

  success: boolean|null = null


  successOptions: {} = { icon: "success", title: "Success !!",   background: '#009432',
            iconColor: '#ffffff',  color:'#ffffff', }
  errorOptions: {} = { icon: "error", title: "Echec !!",   background: '#eb2f06',
            iconColor: '#ffffff',  color:'#ffffff', }

  constructor() {
    this.notify.notifier$.subscribe(data => {
      this.success = (data?.status == 'success')
      if (data && data?.status && data?.message) {
        this.successOptions = { ...this.successOptions, title: data?.message}
        this.errorOptions  = {...this.errorOptions, title: data?.message}
        this.notifyMe()
      }

    })
  }


  notifyMe() {
    const specific: {} = this.success ? {...this.successOptions} :  {...this.errorOptions}
    Swal.fire({
      position: "top",
      showConfirmButton: false,
      timer: 2000,
      width: '400px',
      heightAuto: true,
      toast: true,
      ...specific
    });
  }
}
