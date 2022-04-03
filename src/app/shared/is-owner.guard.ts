import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsOwnerGuard implements CanActivate {

  get currentUserUsername() {
    return localStorage.getItem('<USERNAME>');
  }

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log('IS OWNER GUARD TRIGGERED ');
    
    return new Promise((resolve, reject) => {
      let profileToAccessUsername = route.params['username'];

      console.log('LOCAL NAME: ', this.currentUserUsername);
      console.log('ROUTE NAME: ', route.params['username']);

      if (this.currentUserUsername === profileToAccessUsername) {
        resolve(true);
      } else {
        this.router.navigate(['/app'])
        resolve(false);
      }

    })

  }
  
}
