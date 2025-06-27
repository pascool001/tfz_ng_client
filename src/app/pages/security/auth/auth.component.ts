import { Component, Injector, OnInit, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { provideIcons } from '@ng-icons/core';
import { heroUsers, heroEye, heroEyeSlash } from '@ng-icons/heroicons/outline';
import { SharedModule } from '@shared';
import { AuthStore } from '@stores/security_store';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
      SharedModule
    ],
  providers: [provideIcons({ heroUsers, heroEye, heroEyeSlash })],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {


  auth_store = inject(AuthStore)


  authForm: FormGroup = new FormGroup({})

  showSpinner: boolean = false

  connectionError: boolean = false;

  connectionErrorMessage: null|string|undefined

  inputType: string = 'password'

  constructor(private router: Router, private fb: FormBuilder, private injector: Injector) {
    this.initializeLogging()
  }

  initializeLogging(): void {
    effect(() => {

      if (this.auth_store.loading()) {
        this.showSpinner = true
      } else {
        this.showSpinner = false
      }

      const result = this.auth_store.authResult()
      if (this.auth_store.authenticated()) {
        if (result?.status === 200) {
          this.router.navigate(['/workspace'])
        }
      } else {
        if (result?.status === 401) {
          this.connectionErrorMessage = result.message
          this.connectionError = true
          // console.log('connectionErrorMessage : ', this.connectionErrorMessage)
          this.autoDismissAlert()
        }
      }

    });

  }



changeInputType() {
  if (this.inputType === 'password') {
    this.inputType = 'text'
  } else {
    this.inputType = 'password'
  }
}

buildForm() {
  this.authForm = this.fb.group({
    email: ['pangues001@gmail.com', [Validators.email, Validators.required]],
    password: ['password002', [Validators.minLength(7), Validators.required]],
  })
}

setBoUser() {
 this.authForm.setValue({email:'amanipascal65@gmail.com', password: 'password001'})
}

setSrvUser() {
  this.authForm.setValue({email:'beni001@gmail.com', password: 'beni001'})
}

ngOnInit(): void {
  this.buildForm()
}

connection() {
  this.auth_store.login(this.authForm.value)
}

resetPwdRequest() {
  this.router.navigate(['/auth/pwdresetreq'])
}

  get f(): { [key: string]: AbstractControl } {
    return this.authForm.controls;
  }

  autoDismissAlert() {
    setTimeout(() => {
      this.connectionError = false
      this.auth_store.customPatch({authResult: null})
    }, 5000)
  }

}
