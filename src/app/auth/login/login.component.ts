import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('form') form!: NgForm;

  fireBaseErrorMessage?: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    
    this.authService.login(this.form.value.email, this.form.value.password)
      .then((result) => {
        if (result == null) {
          return;
        } else if (result.isValid == false ) {
          this.fireBaseErrorMessage = result.message;
        }
      })
      ;
  }

}
