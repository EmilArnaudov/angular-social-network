import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

   get user() {
     return this.authService.userLoggedIn;
   }

   get username() {
     return localStorage.getItem('<USERNAME>');
   } 

   form!: FormGroup;
   results: any[] = [];
   queryField: FormControl = new FormControl();

  constructor(private authService: AuthService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.queryField.valueChanges
      .subscribe(result => console.log(result)
      )
  }

  logout() {
    this.authService.logout();
  }

  hideSearchFilter(div: HTMLDivElement) {
    this.renderer.addClass(div, 'hidden');
  }

  showSearchFilter(div: HTMLDivElement) {
    this.renderer.removeClass(div, 'hidden');
  }
}
