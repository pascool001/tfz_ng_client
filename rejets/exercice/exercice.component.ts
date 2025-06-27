// import { Component, OnInit, computed, effect, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
// import { environment as env } from '../../../environments/environment';
// // import { SecurityStore } from '../../services/stores/security-store';
// // import { TodoStore } from '../../services/stores/todoStore';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Itodo } from '../../services/models/todo';

// @Component({
//   selector: 'app-exercice',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule],
//   templateUrl: './exercice.component.html',
//   styleUrl: './exercice.component.css'
// })
// export class ExerciceComponent {
//   title = 'client';
//   base_url = env.base_url
//   _secuStore = inject(SecurityStore)
//   // _todoStore = inject(TodoStore)
//   // todos = this._todoStore.todoStore;

//   todoForm: FormGroup = new FormGroup({})

//   constructor(private fb: FormBuilder) {
//     effect( () => {
//       // if (this._todoStore.todoStore().todos.length !== 0) {
//         // console.log(this._todoStore.todoStore().todos)
//       }
//     } )
//   }

//   todos_string() {
//     return JSON.stringify(this.todos().todos, null, 2)
//   }

//   removeTodo(data: Itodo){
//     // this._todoStore.deleteTodo(data._id)
//   }
  

//   getList() {
//     // return this._todoStore.todoStore().todos
//   }

//   // --------------------------------------------------------------------
//   buildForm() {
//     this.todoForm = this.fb.group({
//       title: ['', [Validators.required]],
//     })
//   }

//   ngOnInit(): void {
//     this.buildForm()
//     // this._todoStore.getAllTodo()
//   }

  
//   FormSubmit() {
//     // this._todoStore.addTodo(this.todoForm.value)
//     // console.log('form value : ', this.todoForm.value)
//   }
  
//   // ---------------------------------------------------------------------
//   login() {
//     this._secuStore.login({
//       "email": "amanipascal65@gmail.com",
//       "password": "password002"
//     })
//   }
//   getMe() {
//     this._secuStore.getMe()
//   }

//   logout() {
//     this._secuStore.logout()
//   }

//   forgotPwd() {
//     this._secuStore.pwdForgotten({email: 'amanipascal65@gmail.com'})
//   }

//   resetPwd() {
//     this._secuStore.resetPassword({
//       userId: "65a7a1af1001a1d31f813591",
//       token: "03ad54cf82d977f8cb432745b7d2e3b3c8091a4356ea934213fdbef328bc672c",
//       password: "password002"
//     })
//   }
  
//   closeSSE() {
//     // this._todoStore.closeSSE() 
//   }
  
 

// }
