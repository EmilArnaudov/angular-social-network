import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class CoreModule { }
