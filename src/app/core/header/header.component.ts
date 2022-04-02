import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SearchService } from '../search.service';

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

  customValue: any = ''; 

   form!: FormGroup;
   results: any[] = [];
   queryField: FormControl = new FormControl();


  constructor(private authService: AuthService, private renderer: Renderer2, private searchService: SearchService) { }

  ngOnInit(): void {
    this.queryField.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => this.searchService.searchQuery(query))
    )
    .subscribe(users => this.results = users)
  }

  clearSearchBar() {

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
