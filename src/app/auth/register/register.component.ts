import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('form') form!: NgForm;
  fireBaseErrorMessage?: string;

  constructor(private authService: AuthService) {
   }

  ngOnInit(): void {

  }

  register() {
    this.authService.register(this.form.value);
  }

}
