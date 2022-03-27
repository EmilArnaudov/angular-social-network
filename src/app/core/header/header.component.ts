import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

   get user() {
     return this.authService.userLoggedIn;
   }

   get username() {
     return localStorage.getItem('<USERNAME>');
   } 

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
