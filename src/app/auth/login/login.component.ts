import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('form') form!: NgForm;

  fireBaseErrorMessage?: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async login() {
    
    let result = await this.authService.login(this.form.value.email, this.form.value.password)
    if (result == null) {
      console.log(localStorage.getItem('<USERNAME>'));
      
      this.router.navigate(['/app'])
    } else if (result.isValid == false ) {
      this.fireBaseErrorMessage = result.message;
    }

  }

}
