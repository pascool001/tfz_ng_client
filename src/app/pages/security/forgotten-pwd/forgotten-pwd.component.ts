import { Component, effect, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '@shared';
import { AuthStore } from '@stores/security_store';

@Component({
  selector: 'app-forgotten-pwd',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './forgotten-pwd.component.html',
  styleUrl: './forgotten-pwd.component.css'
})
export class ForgottenPwdComponent {

  _StoreService = inject(AuthStore)

  pwdReqForm: FormGroup = new FormGroup({})

  requestResponse: any = null;

  loading: boolean = false

  constructor(private router: Router, private fb: FormBuilder) {
    effect( () => {
      if (this._StoreService.loading()) {
        this.loading = this._StoreService.loading()
      } else {
        this.loading = this._StoreService.loading()
      }
      if (this._StoreService.reqResetResult()) {
        this.requestResponse = this._StoreService.reqResetResult()
        if (this.requestResponse.status === 200) {
          this.autoDismissAlert()
        }
      }
    } )
  }

  autoDismissAlert() {
    setTimeout(() => {
      this._StoreService.customPatch({reqResetResult: null})
      this.requestResponse = null;
      this.router.navigate(['/security/auth'])
    }, 5000)
  }


  buildForm() {
    this.pwdReqForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    })
  }

  ngOnInit(): void {
    this.buildForm()
  }

  async Valider() {
    await this._StoreService.pwdForgotten(this.pwdReqForm.value)
  }

  get f(): { [key: string]: AbstractControl } {
    return this.pwdReqForm.controls;
  }

}
