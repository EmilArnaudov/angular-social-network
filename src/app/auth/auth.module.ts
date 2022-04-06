import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SameValueDirective } from './same-value.directive';
import { UsernameExistsDirective } from './username-exists.directive';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    SameValueDirective,
    UsernameExistsDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    SameValueDirective
  ]
})
export class AuthModule { }


