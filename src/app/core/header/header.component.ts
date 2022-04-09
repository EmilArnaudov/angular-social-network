import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/user/user.service';
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

   get userProfilePic() {
     return localStorage.getItem('<PROFILEPIC>');
   }

   likesOnPhotos = this.loadLikesOnPosts();

  customValue: any = ''; 

   form!: FormGroup;
   results: any[] = [];
   queryField: FormControl = new FormControl();


  constructor(private authService: AuthService, private renderer: Renderer2, private searchService: SearchService, private userService: UserService) { }

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
    this.results.splice(0, this.results.length);
    this.customValue = '';
  }

  loadLikesOnPosts() {
    return this.userService.loadUserInfo(this.username)
      .pipe(map((data:DocumentSnapshot<DocumentData>) => {
        let userData = data.data();
        return userData?.['likesOnOwnPosts']
      }))
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
